/**
 * SOLUTION EXERCICE 2 - Extrusion 3D (Réponses Complètes)
 * ========================================================
 * Ceci est la version COMPLÉTÉE de Exercise2_Extrusion.js
 * À utiliser pour vérifier votre travail ou si vous êtes bloqué
 * 
 * Pour utiliser cette solution :
 * 1. Copiez le code complet ci-dessous
 * 2. Ouvrez la console du navigateur (F12)
 * 3. Collez le code
 * 4. Appelez : generateExtrusion()
 * 
 * La visualisation doit apparaître sur la carte avec :
 * ✓ Polygones aplatis au zoom 15
 * ✓ Transition progressive au zoom 15.05
 * ✓ Extrusion 3D au zoom 15.05+
 * ✓ Entrée dans le panneau de contrôle
 */

function generateExtrusion() {
    // Vérifier si l'union existe
    if (!map.getLayer('union')) {
        dissolver();
    }
    
    /**
     * Vérification et création de la couche d'extrusion 3D
     * Utilise interpolation pour effet "pop-up" au zoom 15.05
     */
    if (!map.getLayer('extrusion')) {
        map.addLayer({
            id: 'extrusion',
            type: 'fill-extrusion',     // Type 3D
            source: 'union-source',     // Source : données fusionnées
            paint: {
                /**
                 * Couleur de base
                 * RÉPONSE TODO_1: '#627BC1' (bleu)
                 */
                'fill-extrusion-color': '#627BC1',
                
                /**
                 * Hauteur interpolée selon le zoom
                 * Crée l'effet "pop-up" entre zoom 15 et 15.05
                 */
                'fill-extrusion-height': [
                    'interpolate',                          // RÉPONSE TODO_2
                    ['linear'],                             // RÉPONSE TODO_3
                    ['zoom'],                               // RÉPONSE TODO_4
                    15, 0,                                  // RÉPONSE TODO_5: zoom 15 = hauteur 0
                    15.05, ['get', 'extrusion-height']      // RÉPONSE TODO_6: zoom 15.05 = hauteur réelle
                ],
                
                /**
                 * Base d'extrusion (point de départ)
                 * Même logique que hauteur
                 */
                'fill-extrusion-base': [
                    'interpolate',                          // RÉPONSE TODO_7
                    ['linear'],                             // RÉPONSE TODO_8
                    ['zoom'],                               // RÉPONSE TODO_9
                    15, 0,                                  // RÉPONSE TODO_10,11: zoom 15 = 0
                    15.05, ['get', 'extrusion-base']        // RÉPONSE TODO_12,13: zoom 15.05 = base réelle
                ],
                
                /**
                 * Opacité pour voir les superpositions
                 * RÉPONSE TODO_14: 0.6 (60% opaque)
                 */
                'fill-extrusion-opacity': 0.6
            }
        }, 'water');  // Positionner au-dessus de 'water'
        
        registerLayerControl('extrusion', '2.5D extrusion');
    }
}

console.log('✅ Solution Exercise2_Extrusion chargée');
console.log('Appelez: generateExtrusion() pour tester');
console.log('Note: dissolver() doit être appelé en premier');
