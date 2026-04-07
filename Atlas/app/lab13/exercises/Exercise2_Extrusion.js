/**
 * EXERCICE 2 - Extrusion 3D
 * ========================
 * Objectif : Créer une visualisation 2.5D avec extrusion de polygones
 * 
 * Complétez les zones marquées par "TODO:" pour faire fonctionner le code.
 * Les TODOs demandent des niveaux de zoom, des propriétés, et des expressions d'interpolation.
 * 
 * Difficulté : ⭐⭐⭐ Moyen/Difficile
 * Concepts : interpolation zoom, fill-extrusion, propriétés dynamiques
 */

function generateExtrusion() {
    // Vérifier si l'union existe
    if (!map.getLayer('union')) {
        dissolver();
    }
    
    /**
     * TODO 1 : Configurer la couche d'extrusion 3D
     * =============================================
     * Vous devez remplir :
     * 1. La couleur de base : bleu #627BC1
     * 2. Les hauteurs d'extrusion avec interpolation au zoom
     * 3. Les bases d'extrusion avec interpolation au zoom
     * 4. L'opacité
     * 
     * IMPORTANT : L'extrusion utilise une interpolation entre 2 niveaux de zoom :
     * - Zoom 15.00 : hauteur = 0 (le polygone est PLAT)
     * - Zoom 15.05 : hauteur = valeur réelle (l'extrusion est VISIBLE)
     * 
     * Cela crée un effet "pop-up" au zoom 15.05
     */
    if (!map.getLayer('extrusion')) {
        map.addLayer({
            id: 'extrusion',
            type: 'fill-extrusion',     // Type 3D
            source: 'union-source',     // Source d'données fusionnées
            paint: {
                /**
                 * TODO 1a : Couleur de l'extrusion
                 * Quelle couleur en hexadécimal ?
                 */
                'fill-extrusion-color': 'TODO_1',
                
                /**
                 * TODO 1b : Hauteur de l'extrusion interpolée selon le zoom
                 * ======================================================
                 * Expression 'interpolate' : ['interpolate', ['linear'], ['zoom'], zoom1, hauteur1, zoom2, hauteur2]
                 * 
                 * Vous devez :
                 * - Utiliser 'interpolate' pour l'expression
                 * - Utiliser ['linear'] pour le type d'interpolation
                 * - Utiliser ['zoom'] comme valeur d'entrée
                 * - Zoom 15: hauteur = 0
                 * - Zoom 15.05: hauteur = ['get', 'extrusion-height']
                 */
                'fill-extrusion-height': [
                    'TODO_2',              // 'interpolate' ?
                    ['TODO_3'],            // Type d'interpolation ?
                    ['TODO_4'],            // Entrée ?
                    15, 'TODO_5',          // Zoom 15 -> hauteur 0
                    15.05, 'TODO_6'        // Zoom 15.05 -> hauteur réelle
                ],
                
                /**
                 * TODO 1c : Base de l'extrusion (point de départ)
                 * ================================================
                 * Même logique que fill-extrusion-height mais pour la base
                 * - Zoom 15: base = 0
                 * - Zoom 15.05: base = ['get', 'extrusion-base']
                 */
                'fill-extrusion-base': [
                    'TODO_7',              // Expression ?
                    ['TODO_8'],            // Type ?
                    ['TODO_9'],            // Entrée ?
                    'TODO_10', 'TODO_11',  // Zoom 15 -> 0
                    'TODO_12', 'TODO_13'   // Zoom 15.05 -> prop réelle
                ],
                
                /**
                 * TODO 1d : Opacité de l'extrusion
                 * Valeur entre 0 (transparent) et 1 (opaque)
                 * Suggéré : 0.6 pour voir les superpositions
                 */
                'fill-extrusion-opacity': 'TODO_14'
            }
        }, 'water');
        registerLayerControl('extrusion', '2.5D extrusion');
    }
}

/**
 * CONCEPT CLÉ : Pourquoi cette interpolation entre 15 et 15.05 ?
 * ===============================================================
 * 
 * Les cartes 2.5D/3D avec extrusion supplémentaire au petits zooms
 * créent une parallaxe confuse. L'effet "pop-up" règle ce problème :
 * 
 * Visualisation :
 * Zoom 14.9 : [Polygone PLAT] ← hauteur=0
 * Zoom 15.0 : [Polygone PLAT] ← hauteur=0 (pas encore d'extrusion)
 * Zoom 15.02: [Polygone TRANSITION] ← hauteur=50% (interpolation)
 * Zoom 15.05: [Polygone 3D] ← hauteur=100% (extrusion visible)
 * Zoom 15.1 : [Polygone 3D] ← hauteur=200 units (pleine hauteur)
 * 
 * RÉPONSES (à utiliser pour vérifier) :
 * =====================================
 * TODO_1: '#627BC1'
 * TODO_2: 'interpolate'
 * TODO_3: 'linear'
 * TODO_4: 'zoom'
 * TODO_5: 0
 * TODO_6: ['get', 'extrusion-height']
 * TODO_7: 'interpolate'
 * TODO_8: 'linear'
 * TODO_9: 'zoom'
 * TODO_10: 15
 * TODO_11: 0
 * TODO_12: 15.05
 * TODO_13: ['get', 'extrusion-base']
 * TODO_14: 0.6
 */
