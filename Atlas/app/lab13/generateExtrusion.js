/**
 * Génère une visualisation 2.5D avec extrusion basée sur les propriétés de géométries.
 * Cette fonction crée une couche de polygones extrudés en 3D pour une visualisation volumétrique.
 *
 * @function generateExtrusion
 * @returns {void}
 * 
 * @requires map {maplibregl.Map} - Instance globale de la carte MapLibre GL
 * @requires dissolver() {Function} - Fonction qui crée la couche union des polygones
 * @requires registerLayerControl() {Function} - Fonction d'enregistrement au panneau de contrôle
 *
 * @description
 * Processus :
 * 1. Vérifie si la couche union existe, sinon l'appelle avec dissolver()
 * 2. Vérifie si la couche extrusion n'existe pas déjà (pour éviter les doublons)
 * 3. Ajoute une couche de type 'fill-extrusion' avec :
 *    - Couleur bleue (#627BC1) avec transparence 60%
 *    - Hauteur interpolée en fonction du zoom (pas de parallaxe au zoom 15, effet 3D dès 15.05)
 *    - Base également interpolée pour le point de départ de l'extrusion
 * 4. Place la couche au-dessus de la couche 'water'
 * 5. Enregistre au panneau de contrôle
 *
 * @requires Propriétés dans les données 'union-source' :
 * - extrusion-height {number} : hauteur de l'extrusion en unités
 * - extrusion-base {number} : point de départ de l'extrusion (généralement 0)
 */
function generateExtrusion() {
    /**
     * Vérifie et crée la source union si nécessaire
     * @method map.getLayer
     * @description La couche 'extrusion' dépend de la source 'union-source' créée par dissolver()
     */
    if (!map.getLayer('union')) {
        /**
         * Appelle la fonction dissolver pour créer/fusionner les géométries
         * @see dissolver
         * @description
         * La fonction dissolver() :
         * 1. Fusionne les polygones adjacents
         * 2. Crée la source 'union-source'
         * 3. Ajoute les propriétés 'extrusion-height' et 'extrusion-base'
         */
        dissolver();
    }
    
    /**
     * Vérifie que la couche n'existe pas déjà pour éviter les doublons
     * @method map.getLayer
     */
    if (!map.getLayer('extrusion')) {
        /**
         * Ajoute une couche d'extrusion 3D
         * @method map.addLayer
         * @param {Object} config - Configuration de la couche
         * @param {string} 'water' - Couche de référence (l'extrusion sera au-dessus)
         * 
         * @description
         * Type 'fill-extrusion' : polygone avec hauteur 3D
         * Utilise deux propriétés interpolées basées sur le zoom :
         * - Pour créer un effet de "pop-up" au zoom 15.05
         * - Pas de parallaxe en dessous du zoom 15
         * - Parallaxe complète au-dessus du zoom 15.05
         */
        map.addLayer({
            id: 'extrusion',
            type: 'fill-extrusion',     // Type de couche 3D
            source: 'union-source',     // Source : donnée fusionnée d'union
            paint: {
                /**
                 * Couleur de remplissage de l'extrusion
                 * Bleu (#627BC1) avec opacity 60% pour voir les chevauchements
                 */
                'fill-extrusion-color': '#627BC1',
                
                /**
                 * HAUTEUR DE L'EXTRUSION variable selon le zoom
                 * Expression 'interpolate' : transition lisse entre valeurs
                 * Format : ['interpolate', ['linear'], [entrée], zoom1, hauteur1, zoom2, hauteur2, ...]
                 * 
                 * Effet zoom :
                 * - Zoom 15 : hauteur = 0 (polygone plat)
                 * - Zoom 15.05 : hauteur = valeur réelle (extrusion complète)
                 * - Entre 15 et 15.05 : transition lisse
                 * 
                 * ['get', 'extrusion-height'] : récupère la hauteur depuis les propriétés
                 */
                'fill-extrusion-height': [
                    'interpolate',          // Type d'expression : interpolation lisse
                    ['linear'],             // Type d'interpolation : linéaire
                    ['zoom'],               // Valeur d'entrée : niveau de zoom
                    15, 0,                  // Au zoom 15 : hauteur = 0px
                    15.05, ['get', 'extrusion-height']  // Au zoom 15.05+ : hauteur = valeur réelle
                ],
                
                /**
                 * BASE DE L'EXTRUSION (point de départ)
                 * Même logique que la hauteur mais pour le point de départ
                 * Généralement 0, mais peut être différent pour les toits décalés
                 */
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15, 0,
                    15.05, ['get', 'extrusion-base']
                ],
                
                /**
                 * Transparence de l'extrusion
                 * 0.6 = 60% opaque, permet de voir les superpositions
                 */
                'fill-extrusion-opacity': 0.6
            }
        }, 'water');  // Positionnement : au-dessus de la couche 'water'
        
        /**
         * Enregistre la couche au panneau de contrôle
         * @see registerLayerControl
         */
        registerLayerControl('extrusion', '2.5D extrusion');
    }
}