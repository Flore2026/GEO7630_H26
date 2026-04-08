/**
 * EXERCICE 2 - Extrusion 3D
 * ========================
 * Objectif : Transformer une grille de densité en volume 3D
 * 
 * Complétez les zones marquées par "TODO:" pour faire fonctionner le code.
 * Cet exercice vous apprend à utiliser :
 * - fill-extrusion
 * - expressions MapLibre
 * - propriétés de source ('pointCount')
 * - interpolation de zoom pour créer un effet pop-up
 * 
 * Difficulté : ⭐⭐⭐ Moyen/Difficile
 * Concepts : fill-extrusion, interpolation, expression ['get'], zoom
 */

function generateExtrusion() {
    // Vérifie que la source de grille existe. Si elle est absente, la jointure doit être créée avant.
    if (!map.getSource('grid-source')) {
        console.warn('Source grid-source manquante : exécutez d\'abord la jointure spatiale pour créer la grille.');
    }

    /**
     * TODO 1 : Ajouter la couche d'extrusion 3D
     * ========================================
     * Utilise la source 'grid-source' et la propriété 'pointCount'
     * pour construire des volumes 3D qui montent en fonction du nombre de points.
     */
    if (!map.getLayer('extrusion')) {
        map.addLayer({
            id: 'extrusion',
            type: 'fill-extrusion',            // Type de couche 3D
            source: 'grid-source',          // Source de données de la grille
            paint: {
                /**
                 * TODO 1a : Couleur de l'extrusion selon la densité
                 * Utilisez une expression 'interpolate' sur ['get', 'pointCount']
                 * pour passer d'une couleur claire à une couleur foncée.
                 */
                'fill-extrusion-color': [
                    'interpolate',              // Expression d'interpolation
                    ['linear'],            // Type biologique (linéaire)
                    ['get', 'pointCount'],            // Entrée : propriété pointCount
                    0, '#a7e0e286',           // 0 points -> couleur claire
                    1, '#359c9c',           // 1 point -> couleur intermédiaire
                    3, '#b3be17',           // 3 points -> couleur plus chaude
                    5, '#a02f39',           // 5 points -> couleur forte
                    10, '#291804'          // 10 points -> couleur la plus sombre
                ],

                /**
                 * TODO 1b : Hauteur de l'extrusion
                 * Utilisez la propriété 'pointCount' et multipliez-la
                 * par une constante pour produire une hauteur visible.
                 */
                'fill-extrusion-height': [
                    '*',             // Expression arithmétique
                    ['get', 'pointCount'],// Propriété pointCount
                    1000              // Facteur de multiplication
                ],

                /**
                 * TODO 1c : Base d'extrusion
                 * La base reste au sol pour commencer à 0.
                 */
                'fill-extrusion-base': 0,

                /**
                 * TODO 1d : Opacité
                 * Gardez un peu de transparence pour voir les superpositions.
                 */
                'fill-extrusion-opacity': 0.5
            }
        });
        registerLayerControl('extrusion', '2.5D extrusion');
    }
}

/**
 * NOTES D'APPRENTISSAGE :
 * - 'fill-extrusion' transforme une surface en volume 3D.
 * - 'fill-extrusion-color' peut être une expression pour afficher la densité.
 * - 'fill-extrusion-height' accepte des expressions mathématiques.
 * - 'fill-extrusion-base' permet de contrôler la hauteur de départ.
 * - 'pointCount' est produit par la jointure spatiale sur la grille.
 */
