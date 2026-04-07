# **Laboratoire 11**

**Objectif : Apprendre comment configurer un Geoserver et mettre en place de services VTS et WFS**

La première étape a consisté à la création d’un environnement virtuel de travail en lançant un nouveau codespace.

**N.B. N’ayant plus accès au codespace pour le mois de mars, j’ai reçu l’autorisation de me connecter et de travailler avec le codespace d’une collègue de classe**

Cette environnement a ensuite été configurer avec nos informations personnelles après avoir copie et renommer le fichier « .env.example » en « .env. »  

Nous avons ensuite installé l’extension docker puis lancée pour nous permettre d’avoir accès aux conteneurs.

## **1.	Ajout de contrôles de carte**

Trois variables ont été ajouté dans le fichier app.js pour le :

-	Contrôle de la navigation
-	Contrôle de la géolocalisation
-	Contrôle de l’échelle

## **2.	Chargement de données depuis un serveur de tuiles vectorielles**

-	On ajoute une fonction spécifique (map.onLoad()). 
-	On déclare la source de notre couche à utiliser en copiant l’url à partir de l’interface de notre serveur de tuiles en prenant soin de modifier l’adresse du serveur lorsqu’on la colle sur notre fonction dans js.
-	On ajoute la couche avec addLayer puis on recherche la carte pour voir les données 
-	En cas de besoin, on vérifier que le service de tuiles est bien public et accessible

![alt text](<Capture d’écran 2026-03-31 213756.png>)

## **3.	Ajout du style**

-	Un premier test de stylisation a été ajouté pour obtenir une couleur rouge de notre couche

![alt text](<Capture d’écran 2026-03-31 2139402.png>)

-	Une seconde stylisation nous a permis de donner la couleur au polygone sur base d’une interpolation linéaire d’une des propriétés de notre couche. 

![alt text](<Capture d’écran 2026-03-31 2139593.png>)

## **4.	Ajout d’une couche WFS**

-	A partir du port 9000 (pg_featurserv), nous avons fait une copie de l’url du service WFS et nous l’avons ajouté sur notre fonction loadWFS() dans app.js
-	On ajoute ensuite notre source avec map.addsource puis on ajoute la couche à la carte MapLibre
-	Dans le fichier html, on ajoute un bouton qui déclenche la fonction ajoutée (Load WSF Data).

![alt text](<Capture d’écran 2026-03-31 214937_4.png>)