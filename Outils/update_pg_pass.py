"""
Script de changement de mot de passe PostgreSQL (self-service étudiant)

Ce script permet à un étudiant de changer SON PROPRE mot de passe PostgreSQL.
Aucun droit admin n’est requis.

Principe :
- l’étudiant se connecte avec son utilisateur actuel
- PostgreSQL sait qui il est (current_user)
- le mot de passe du rôle courant est mis à jour

Le mot de passe n’est jamais affiché à l’écran.

!!!! Important il faut installer psycopg : pip install psycopg !!!
"""

import getpass
import psycopg
from psycopg import sql  # <-- IMPORTANT


def main():
    print("=== Changer mon mot de passe PostgreSQL ===")

    # ------------------------------------------------------------------
    # 1) Informations de connexion à la base (FIXES pour le cours)
    # ------------------------------------------------------------------
    host = "geo7630.c124ic8ew2kc.ca-central-1.rds.amazonaws.com"
    port = "5432"
    dbname = "geo7630h26"

    print(f"Serveur : {host}")
    print(f"Base de données : {dbname}\n")

    # ------------------------------------------------------------------
    # 2) Identité de l'étudiant (À REMPLIR PAR L'ÉTUDIANT)
    # ------------------------------------------------------------------
    # IMPORTANT: ce que tu mets dans input(...) est un PROMPT, pas la valeur.
    user = input("Nom d'utilisateur PostgreSQL (Votre CodeMS ex : ab123456): ").strip()
    if not user:
        raise SystemExit("Erreur: nom d'utilisateur vide.")

    current_password = getpass.getpass("Mot de passe actuel: ")
    if not current_password:
        raise SystemExit("Erreur: mot de passe actuel vide (tu as peut-être juste appuyé Enter).")

    # ------------------------------------------------------------------
    # 3) Nouveau mot de passe
    # ------------------------------------------------------------------
    new_password = getpass.getpass("Nouveau mot de passe: ")
    confirm = getpass.getpass("Confirmer nouveau mot de passe: ")

    if new_password != confirm:
        raise SystemExit("Erreur: les mots de passe ne correspondent pas.")

    # if len(new_password) < 12:
    #     raise SystemExit("Erreur: mot de passe trop court (minimum 12 caractères).")

    # ------------------------------------------------------------------
    # 4) Chaîne de connexion PostgreSQL
    # ------------------------------------------------------------------
    dsn = (
        f"host={host} "
        f"port={port} "
        f"dbname={dbname} "
        f"user={user} "
        f"password={current_password}"
    )

    try:
        # ------------------------------------------------------------------
        # 5) Connexion + vérification de l'identité (DEBUG pédagogique)
        # ------------------------------------------------------------------
        with psycopg.connect(dsn) as conn:
            conn.autocommit = True  # ALTER ROLE doit être exécuté hors transaction

            with conn.cursor() as cur:
                # Vérification: à quel utilisateur suis-je réellement connecté ?
                cur.execute("SELECT current_user;")
                actual_user = cur.fetchone()[0]
                print(f"Connecté comme: {actual_user}")

                if actual_user != user:
                    raise SystemExit(
                        f"Erreur: tu es connecté comme '{actual_user}' mais tu as entré '{user}'."
                    )

                # PostgreSQL n'accepte pas $1 pour PASSWORD dans ALTER ROLE
                query = sql.SQL(
                    "ALTER ROLE current_user WITH PASSWORD {}"
                ).format(
                    sql.Literal(new_password)
                )
                cur.execute(query)

        # ------------------------------------------------------------------
        # 6) Test de reconnexion immédiate (preuve que le mot de passe fonctionne)
        # ------------------------------------------------------------------
        test_dsn = (
            f"host={host} "
            f"port={port} "
            f"dbname={dbname} "
            f"user={user} "
            f"password={new_password}"
        )

        with psycopg.connect(test_dsn) as conn2:
            conn2.close()

        print("Mot de passe changé avec succès (reconnexion validée).")

    except Exception as e:
        raise SystemExit(f"Échec du changement de mot de passe : {e}")


if __name__ == "__main__":
    main()
