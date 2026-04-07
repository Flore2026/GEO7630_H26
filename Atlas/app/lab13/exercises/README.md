# 📚 Exercices Lab13 - Code à Trou

Bienvenue dans les exercices hands-on du Lab13 ! 

Ces exercices vous permettront de mieux comprendre les concepts de visualisation cartographique en MapLibre GL en complétant vous-même le code.

## 📋 Vue d'ensemble

Trois exercices progressifs basés sur les modules de visualisation documentés :

| Exercice | Nom | Difficulté | Temps estimé | Concepts clés |
|----------|------|-----------|-------------|--------------|
| 1 | Clusters | ⭐⭐ Facile/Moyen | 20-30 min | Sources GeoJSON, clustering, filtres, expressions `step` |
| 2 | Extrusion 3D | ⭐⭐⭐ Moyen/Difficile | 30-45 min | Interpolation zoom, fill-extrusion, propriétés dynamiques |
| 3 | Heatmap | ⭐⭐⭐⭐ Difficile | 45-60 min | Expressions `interpolate` complexes, densité, dégradés |

---

## 🎯 Objectifs d'apprentissage

### Exercice 1 - Clusters
- Comprendre les sources GeoJSON
- Configurer le clustering automatique
- Utiliser les expressions `step` pour les styles gradués
- Créer des filtres de couches
- Calculer les propriétés générées (`point_count`)

**Questions clés à vous poser :**
- Pourquoi avons-nous besoin de deux couches (clusters + points individuels) ?
- Comment le clustering change-t-il selon le niveau de zoom ?
- Qu'est-ce que la propriété `point_count` et d'où vient-elle ?

### Exercice 2 - Extrusion 3D
- Maîtriser les expressions `interpolate` pour transitions lisses
- Comprendre l'effet parallaxe entre niveaux de zoom
- Configurer les couches `fill-extrusion`
- Créer des transitions "pop-up" au zoom
- Positionner les couches dans la hiérarchie rendue

**Questions clés à vous poser :**
- Pourquoi l'extrusion est-elle aplatie au zoom 15 mais surélevée au zoom 15.05 ?
- Quelle différence entre `fill-extrusion-height` et `fill-extrusion-base` ?
- Comment ordonne-t-on l'affichage des couches ?

### Exercice 3 - Heatmap
- Différencier `['zoom']` et `['heatmap-density']`
- Créer des dégradés de couleurs complexes
- Configurer la contribution dynamique des points
- Adapter l'opacité et l'intensité au zoom
- Optimiser le rayon d'influence pour une bonne visualisation

**Questions clés à vous poser :**
- Quelle est la différence entre `heatmap-weight` et `heatmap-intensity` ?
- Pourquoi changer l'opacité selon le zoom ?
- Comment interpréter les valeurs de `heatmap-density` ?

---

## 🚀 Comment utiliser ces exercices

### Méthode 1 : Complétion directe (Recommandée)

1. **Ouvrez le fichier** `Exercise1_Clusters.js` dans VS Code
2. **Lisez** les commentaires et les descriptions du code
3. **Identifiez** tous les `TODO_X` dans le fichier
4. **Recherchez** les indices fournis dans les commentaires
5. **Complétez** les valeurs manquantes
6. **Testez** :
   - Copiez le code complété dans la console du navigateur
   - Ou importez-le dans votre application principale
   - Appelez la fonction : `generateClusters()`
   - Vérifiez que la visualisation apparaît correctement

### Méthode 2 : Comparaison avec l'original

1. **Complétez** le fichier exercice
2. **Comparez** avec le fichier original documenté `generateClusters.js`
3. **Identifiez** les différences
4. **Comprenez** pourquoi ces valeurs spécifiques

### Méthode 3 : Debugging progressif

1. **Remplissez** les TODOs une couche à la fois
2. **Testez** après chaque section
3. **Utilisez** la console du navigateur pour les erreurs
4. **Progressez** graduellement

---

## 💡 Indices et Stratégie

### Pour les valeurs manquantes

**Pensez à :**
- Les commentaires du code original documenté
- Les tableaux dans le REA `README.md` du lab13
- Les palettes de couleurs CSS : `#51bbd6` (cyan), `#f1f075` (jaune), etc.
- Les niveaux de zoom : généralement 0-22
- Les valeurs proportionnelles : 0 à 1 pour opacité, poids, etc.

### Pour les expressions

**Patterns à reconnaître :**
- `['step', ...]` = changement discret à certains seuils
- `['interpolate', ['linear'], ['zoom'], ...]` = transition lisse selon le zoom
- `['interpolate', ['linear'], ['heatmap-density'], ...]` = dégradé selon la densité
- `['get', 'property']` = récupérer une valeur de propriété
- `['has', 'property']` = filtrer selon l'existence d'une propriété

### Format des TODOs

```javascript
'TODO_1'          // Valeur simple : chaîne, nombre, couleur
'TODO_2', 'TODO_3' // Paire : clé-valeur ou seuil-valeur
```

---

## ✅ Vérification de votre travail

### Checklist pour Exercice 1 - Clusters

- [ ] La source 'clusters-source' est correctement configurée
- [ ] Les deux couches (clusters + points) s'affichent
- [ ] Les clusters changent de couleur avec la densité
- [ ] Les clusters changent de taille avec la densité
- [ ] Au zoom élevé (15+), les points individuels apparaissent
- [ ] Au zoom faible (10-), seuls les clusters sont visibles
- [ ] Les deux couches apparaissent dans le panneau de contrôle

### Checklist pour Exercice 2 - Extrusion

- [ ] La couche union existe et est créée par `dissolver()`
- [ ] La couche 'extrusion' est correctement configurée
- [ ] Au zoom 15 exactement, l'extrusion est invisible (aplatie)
- [ ] Au zoom 15.05+, l'extrusion devient visible (pop-up)
- [ ] La couleur est bleu (#627BC1)
- [ ] L'opacité permet de voir les superpositions (0.6)
- [ ] L'extrusion apparaît au-dessus de la couche 'water'

### Checklist pour Exercice 3 - Heatmap

- [ ] La source 'heatmap-source' contient les randomPoints
- [ ] La heatmap s'affiche avec couleurs dégradées
- [ ] Le dégradé va du bleu (faible densité) au rouge (haute densité)
- [ ] Au zoom faible, la heatmap est faible (poids=0)
- [ ] Au zoom élevé, la heatmap est forte (poids=1)
- [ ] Les zones denses sont bien visibles (rouge)
- [ ] L'opacité diminue légèrement au zoom 9+

---

## 🔍 Ressources d'aide

### Documentation MapLibre GL

- **Types de sources** https://maplibre.org/maplibre-gl-js/docs/API/sources/
- **Types de couches** : https://maplibre.org/maplibre-gl-js/docs/API/layers/
- **Expressions** : https://maplibre.org/maplibre-style-spec/expressions/

### Concepts clés

**Clustering automatique (MapLibre) :**
- Paramètre `cluster: true` dans la source
- Génère propriété `point_count` pour chaque cluster
- Cette propriété existe SEULEMENT pour les clusters, pas les points seuls

**Expressions :**
- `['step', ...]` : Graduation discrète (paliers)
- `['interpolate', ...]` : Transition lisse (linéaire, cubique, etc.)

**Zoom :**
- Entier ou décimal (14.5 est valid)
- Utilisé pour animations et transitions progressives

---

## 🎓 Correction progressive

### Si vous êtes bloqué sur un TODO

**Cherchez dans cet ordre :**

1. **Les commentaires** du même fichier
   ```javascript
   // Quelle couleur en hexadécimal ?
   'fill-extrusion-color': 'TODO_1',
   ```

2. **Les autres TODOs** du même groupe
   - Si TODO_6 est "couleur par défaut (0-99 points)", TODO_7-8 parlent probablement de seuil 100

3. **Le fichier original** `generateClusters.js`
   - Voir les valeurs réelles
   - Comprendre le contexte

4. **Les indices fournis** à la fin du fichier exercice
   - Tous les TODOs ont une réponse en bas du fichier
   - À utiliser pour vérifier APRÈS votre travail

---

## 📊 Exemple de progression

### Chapitre 1 (Débutant)
Complétez uniquement les **valeurs numériques et couleurs** (TODO_1 à TODO_5)
```javascript
type: 'TODO_1'      // Facile : 'geojson'
cluster: 'TODO_3'   // Facile : true
```

### Chapitre 2 (Intermédiaire)
Complétez les **structure d'expression** (TODO_6 à TODO_15)
```javascript
'circle-color': [
    'step',
    ['get', 'point_count'],
    'TODO_6',  // Facile : couleur
    100, 'TODO_8'  // Moyen : structure
]
```

### Chapitre 3 (Avancé)
Complétez les **expressions complexes** (Exercise 3)
```javascript
'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],  // Attention : pas zoom !
    // ...
]
```

---

## 🏆 Au-delà de la correction

Une fois vos exercices complétés et fonctionnels :

### Défi 1 - Personnalisation
Modifiez les valeurs pour explorer :
- Autres palettes de couleurs (HSL, RGB)
- Différents niveaux de zoom d'interpolation
- Autres rayons de clustering

### Défi 2 - Intégration
Fusionnez les 3 exercices dans une seule application :
- Boutons pour basculer entre visualisations
- Slider pour ajuster les paramètres
- Comparaison côte à côte

### Défi 3 - Créativité
Créez votre propre visualisation combisant concepts :
- Clusters avec extrusion
- Heatmap avec extrusion
- Filtres interactifs

---

## ❓ FAQ - Code à Trou

**Q : Comment savoir si ma réponse est correcte ?**\nA : Le code s'exécute sans erreur ET la visualisation s'affiche correctement. Les valeurs spécifiques doivent correspondre au template.

**Q : Puis-je utiliser les réponses en bas du fichier ?**\nA : OUI, après avoir essayé au minimum 15-20 minutes. Les réponses sont là pour vérifier, pas pour tricher !

**Q : Et si j'utilise des valeurs différentes ?**\nA : Certaines valeurs ont alternatives valides (ex: autres couleurs), mais les valeurs proposées assurent les résultats documentés.

**Q : Comment progresser vite ?**\nA : Groupez les TODOs par concept (couleurs, zooms, expressions) et complétez-les par groupe logique.

---

## 📞 Support

Pour chaque exercice, gardez à portée de main :
- Ce README
- Le fichier documenté original (`generateClusters.js`, etc.)
- La documentation MapLibre GL
- La console du navigateur (F12 → Console)

Bonne chance ! 🚀\n"
