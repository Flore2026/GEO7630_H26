set -euo pipefail

############################
# CONFIG (à éditer)
############################
REGION="${AWS_REGION:-ca-central-1}"
export AWS_DEFAULT_REGION="$REGION"
export AWS_REGION="$REGION"

PREFIX="geo7630H26"                # change par session si tu veux
DB_INSTANCE_ID="${PREFIX}-pg"
DB_NAME="geo7630"

DB_ADMIN_USER="geo7630_admin"
DB_ADMIN_PW="!CHANGE_ME_STRONG_PASSWORD!"  # mets un vrai mot de passe

# 1 = supprime puis recrée si existe (CLEAN). 0 = ne supprime pas (SAFE).
RESET=1

# Public Internet (simple). Change si tu veux restreindre.
OPEN_CIDR="0.0.0.0/0"

# Postgres major (family du parameter group)
PG_MAJOR="16"
DB_CLASS="db.t4g.micro"
ALLOCATED_STORAGE_GB="20"

############################
# 1) Trouver le default VPC + subnets
############################
VPC_ID="$(aws ec2 describe-vpcs --region "$REGION" --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)"
if [[ "$VPC_ID" == "None" || -z "$VPC_ID" ]]; then
  echo "ERROR: no default VPC in $REGION. Adapte le script à ton VPC."
  exit 1
fi

SUBNET_IDS=($(aws ec2 describe-subnets --region "$REGION" --filters Name=vpc-id,Values="$VPC_ID" --query 'Subnets[].SubnetId' --output text))
if [[ "${#SUBNET_IDS[@]}" -lt 2 ]]; then
  echo "ERROR: need at least 2 subnets for an RDS subnet group."
  exit 1
fi

############################
# 2) RESET (optionnel)
############################
if [[ "$RESET" -eq 1 ]]; then
  if aws rds describe-db-instances --region "$REGION" --db-instance-identifier "$DB_INSTANCE_ID" >/dev/null 2>&1; then
    echo "Deleting existing DB instance: $DB_INSTANCE_ID"
    aws rds delete-db-instance \
      --region "$REGION" \
      --db-instance-identifier "$DB_INSTANCE_ID" \
      --skip-final-snapshot \
      --delete-automated-backups || true
    aws rds wait db-instance-deleted --region "$REGION" --db-instance-identifier "$DB_INSTANCE_ID" || true
  fi
fi

############################
# 3) DB subnet group (idempotent)
############################
DB_SUBNET_GROUP="${PREFIX}-subnets"
if ! aws rds describe-db-subnet-groups --region "$REGION" --db-subnet-group-name "$DB_SUBNET_GROUP" >/dev/null 2>&1; then
  aws rds create-db-subnet-group \
    --region "$REGION" \
    --db-subnet-group-name "$DB_SUBNET_GROUP" \
    --db-subnet-group-description "Subnet group for $PREFIX" \
    --subnet-ids "${SUBNET_IDS[@]}" >/dev/null
fi

############################
# 4) Security group (idempotent) + ouverture 5432
############################
SG_NAME="${PREFIX}-rds-sg"
SG_ID="$(aws ec2 describe-security-groups --region "$REGION" --filters Name=vpc-id,Values="$VPC_ID" Name=group-name,Values="$SG_NAME" --query 'SecurityGroups[0].GroupId' --output text)"
if [[ "$SG_ID" == "None" ]]; then
  SG_ID="$(aws ec2 create-security-group --region "$REGION" --group-name "$SG_NAME" --description "RDS public access for $PREFIX" --vpc-id "$VPC_ID" --query 'GroupId' --output text)"
fi

aws ec2 authorize-security-group-ingress --region "$REGION" \
  --group-id "$SG_ID" \
  --ip-permissions "IpProtocol=tcp,FromPort=5432,ToPort=5432,IpRanges=[{CidrIp=$OPEN_CIDR,Description='Public Postgres for course'}]" \
  >/dev/null 2>&1 || true

############################
# 5) (Optionnel mais recommandé) Force TLS via parameter group
# Note: sur PostgreSQL 15+ la doc indique que rds.force_ssl est ON par défaut. :contentReference[oaicite:2]{index=2}
############################
PGROUP="${PREFIX}-pg${PG_MAJOR}-params"
FAMILY="postgres${PG_MAJOR}"

if ! aws rds describe-db-parameter-groups --region "$REGION" --db-parameter-group-name "$PGROUP" >/dev/null 2>&1; then
  aws rds create-db-parameter-group \
    --region "$REGION" \
    --db-parameter-group-name "$PGROUP" \
    --db-parameter-group-family "$FAMILY" \
    --description "Params for $PREFIX (force ssl)" >/dev/null
fi

aws rds modify-db-parameter-group \
  --region "$REGION" \
  --db-parameter-group-name "$PGROUP" \
  --parameters "ParameterName=rds.force_ssl,ParameterValue=1,ApplyMethod=immediate" >/dev/null

############################
# 6) Create RDS instance + initial DB
# --db-name crée la DB initiale (sinon 'postgres'). :contentReference[oaicite:3]{index=3}
############################
if ! aws rds describe-db-instances --region "$REGION" --db-instance-identifier "$DB_INSTANCE_ID" >/dev/null 2>&1; then
  aws rds create-db-instance \
    --region "$REGION" \
    --db-instance-identifier "$DB_INSTANCE_ID" \
    --engine postgres \
    --engine-version "$PG_MAJOR" \
    --db-instance-class "$DB_CLASS" \
    --allocated-storage "$ALLOCATED_STORAGE_GB" \
    --storage-type gp3 \
    --master-username "$DB_ADMIN_USER" \
    --master-user-password "$DB_ADMIN_PW" \
    --db-name "$DB_NAME" \
    --publicly-accessible \
    --vpc-security-group-ids "$SG_ID" \
    --db-subnet-group-name "$DB_SUBNET_GROUP" \
    --db-parameter-group-name "$PGROUP" \
    --backup-retention-period 1 \
    --no-multi-az \
    --auto-minor-version-upgrade >/dev/null
fi

aws rds wait db-instance-available --region "$REGION" --db-instance-identifier "$DB_INSTANCE_ID"

ENDPOINT="$(aws rds describe-db-instances --region "$REGION" --db-instance-identifier "$DB_INSTANCE_ID" --query 'DBInstances[0].Endpoint.Address' --output text)"
PORT="$(aws rds describe-db-instances --region "$REGION" --db-instance-identifier "$DB_INSTANCE_ID" --query 'DBInstances[0].Endpoint.Port' --output text)"

echo "=== RDS READY ==="
echo "Endpoint: $ENDPOINT"
echo "Port:     $PORT"
echo "DB:       $DB_NAME"
echo "Admin:    $DB_ADMIN_USER"
echo "TLS tip:  use sslmode=require"

############################
# 7) Suppression auto +4 mois (Scheduler one-time -> Lambda deleter)
# One-time schedules support at(...). :contentReference[oaicite:4]{index=4}
############################
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
DELETE_AT_UTC="$(date -u -d "+4 months" +"%Y-%m-%dT%H:%M:%S")"
SCHEDULE_EXPR="at(${DELETE_AT_UTC})"

LAMBDA_NAME="${PREFIX}-rds-deleter"
SCHED_NAME="${PREFIX}-delete-at-4mo"

# IAM role for Lambda
LAMBDA_ROLE_NAME="${PREFIX}-lambda-role"
LAMBDA_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${LAMBDA_ROLE_NAME}"

cat > /tmp/lambda-trust.json <<'JSON'
{
  "Version":"2012-10-17",
  "Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]
}
JSON

if ! aws iam get-role --role-name "$LAMBDA_ROLE_NAME" >/dev/null 2>&1; then
  aws iam create-role --role-name "$LAMBDA_ROLE_NAME" --assume-role-policy-document file:///tmp/lambda-trust.json >/dev/null
fi

cat > /tmp/lambda-policy.json <<'JSON'
{
  "Version":"2012-10-17",
  "Statement":[
    {"Effect":"Allow","Action":["rds:DeleteDBInstance","rds:DescribeDBInstances","rds:DeleteAutomatedBackups"],"Resource":"*"},
    {"Effect":"Allow","Action":["logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"],"Resource":"*"}
  ]
}
JSON
aws iam put-role-policy --role-name "$LAMBDA_ROLE_NAME" --policy-name "${PREFIX}-lambda-inline" --policy-document file:///tmp/lambda-policy.json >/dev/null

# Lambda code (delete instance)
cat > /tmp/lambda_function.py <<PY
import os, boto3
rds = boto3.client("rds")
def lambda_handler(event, context):
    db_id = os.environ["DB_INSTANCE_ID"]
    rds.delete_db_instance(DBInstanceIdentifier=db_id, SkipFinalSnapshot=True, DeleteAutomatedBackups=True)
    return {"deleted": db_id}
PY
cd /tmp
zip -q /tmp/function.zip /tmp/lambda_function.py

if aws lambda get-function --region "$REGION" --function-name "$LAMBDA_NAME" >/dev/null 2>&1; then
  aws lambda update-function-code --region "$REGION" --function-name "$LAMBDA_NAME" --zip-file fileb:///tmp/function.zip >/dev/null
else
  aws lambda create-function \
    --region "$REGION" \
    --function-name "$LAMBDA_NAME" \
    --runtime python3.12 \
    --handler lambda_function.lambda_handler \
    --role "$LAMBDA_ROLE_ARN" \
    --zip-file fileb:///tmp/function.zip \
    --timeout 30 \
    --environment "Variables={DB_INSTANCE_ID=${DB_INSTANCE_ID}}" >/dev/null
fi

LAMBDA_ARN="$(aws lambda get-function --region "$REGION" --function-name "$LAMBDA_NAME" --query 'Configuration.FunctionArn' --output text)"

# Scheduler execution role (must exist when using CLI) :contentReference[oaicite:5]{index=5}
SCHED_ROLE_NAME="${PREFIX}-scheduler-role"
SCHED_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${SCHED_ROLE_NAME}"

cat > /tmp/scheduler-trust.json <<'JSON'
{
  "Version":"2012-10-17",
  "Statement":[{"Effect":"Allow","Principal":{"Service":"scheduler.amazonaws.com"},"Action":"sts:AssumeRole"}]
}
JSON

if ! aws iam get-role --role-name "$SCHED_ROLE_NAME" >/dev/null 2>&1; then
  aws iam create-role --role-name "$SCHED_ROLE_NAME" --assume-role-policy-document file:///tmp/scheduler-trust.json >/dev/null
fi

cat > /tmp/scheduler-policy.json <<JSON
{
  "Version":"2012-10-17",
  "Statement":[{"Effect":"Allow","Action":["lambda:InvokeFunction"],"Resource":["$LAMBDA_ARN"]}]
}
JSON
aws iam put-role-policy --role-name "$SCHED_ROLE_NAME" --policy-name "${PREFIX}-scheduler-invoke" --policy-document file:///tmp/scheduler-policy.json >/dev/null

# optional: allow scheduler to invoke Lambda (safe if already there)
aws lambda add-permission \
  --region "$REGION" \
  --function-name "$LAMBDA_NAME" \
  --statement-id "${PREFIX}-scheduler" \
  --action "lambda:InvokeFunction" \
  --principal "scheduler.amazonaws.com" >/dev/null 2>&1 || true

# Create schedule (replace if exists) + auto-delete schedule after it runs
if aws scheduler get-schedule --region "$REGION" --name "$SCHED_NAME" >/dev/null 2>&1; then
  aws scheduler delete-schedule --region "$REGION" --name "$SCHED_NAME" >/dev/null
fi

aws scheduler create-schedule \
  --region "$REGION" \
  --name "$SCHED_NAME" \
  --schedule-expression "$SCHEDULE_EXPR" \
  --flexible-time-window Mode=OFF \
  --action-after-completion DELETE \
  --target "Arn=${LAMBDA_ARN},RoleArn=${SCHED_ROLE_ARN}" >/dev/null

echo "=== AUTO-DELETE SCHEDULED ==="
echo "Deletion time (UTC): $DELETE_AT_UTC"
echo "Schedule expr:       $SCHEDULE_EXPR"
