/**
 * Génère une carte de chaleur (heatmap) à partir des points aléatoires.
 * Cette fonction crée une visualisation continue de la densité spatiale avec dégradé de couleurs.
 *
 * @function generateHeatmap
 * @returns {void}
 * 
 * @requires randomPoints {FeatureCollection} - Variable globale contenant les points en GeoJSON
 * @requires map {maplibregl.Map} - Instance globale de la carte MapLibre GL
 * @requires removeAllLayersAndSources() {Function} - Fonction de nettoyage des couches
 * @requires registerLayerControl() {Function} - Fonction d'enregistrement au panneau de contrôle
 *
 * @description
 * Processus :
 * 1. Nettoie toutes les couches et sources existantes
 * 2. Crée une source GeoJSON simple (pas de clustering)
 * 3. Ajoute une couche 'heatmap' avec :
 *    - Poids interpolé selon le zoom (activation progressive)
 *    - Intensité interpolée selon le zoom (contraste dynamique)
 *    - Couleur avec dégradé 7 niveaux (bleu transparent à rouge)
 *    - Rayon d'influence interpolé selon le zoom
 *    - Opacité qui diminue au zoom élevé
 * 4. Enregistre au panneau de contrôle
 *
 * @description Dégradé de couleur (densité) :
 * - 0% densité : Transparent (rgba(0, 0, 255, 0))
 * - 10% densité : Bleu royal (royalblue)
 * - 30% densité : Cyan (cyan)
 * - 50% densité : Vert citron (lime)
 * - 70% densité : Jaune (yellow)
 * - 100% densité : Rouge (red)
 */
function generateHeatmap() {
    /**
     * Supprime tous les layers et sources de la carte
     * @see removeAllLayersAndSources
     */
    removeAllLayersAndSources();
    
    /**
     * Ajoute une source de données GeoJSON pour la heatmap
     * @method map.addSource
     * @param {string} 'heatmap-source' - ID unique de la source
     * @param {Object} config - Configuration de la source
     * @param {string} config.type - Type de source ('geojson')
     * @param {FeatureCollection} config.data - Données GeoJSON (randomPoints)
     * 
     * @note Contrairement à clusters-source, pas de clustering ici
     */
    map.addSource('heatmap-source', {
        type: 'geojson',
        data: randomPoints
    });
    
    /**
     * Ajoute une couche de type heatmap
     * @method map.addLayer
     * @description
     * Type 'heatmap' : crée une carte de chaleur continue
     * Tous les paramètres 'paint' utilisent des expressions 'interpolate'
     * pour créer des transitions lisses et dépendantes du zoom
     */
    map.addLayer({
        id: 'heatmap',
        type: 'heatmap',            // Type de visualisation
        source: 'heatmap-source',   // Source de données
        paint: {
            /**
             * POIDS DE CHAQUE POINT (contribution à la heatmap)
             * Expression 'interpolate' ['linear'] basée sur ['zoom']
             * 
             * Effet zoom :
             * - Zoom 0 : poids = 0 (pas de contribution)
             * - Zoom 22 : poids = 1 (contribution maximale)
             * - Entre : transition linéaire
             * 
             * Cela crée un "fade-in" progressif de la heatmap en zoomant
             */
            'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 0,       // Zoom petit = poids faible (heatmap invisible)
                22, 1       // Zoom grand = poids fort (heatmap visible)
            ],
            
            /**
             * INTENSITÉ DE LA HEATMAP (multiplicateur de contraste)
             * Contrôle le contraste global du rendu
             * 
             * Effet zoom :
             * - Zoom 0 : intensité = 0 (pas de contraste)
             * - Zoom 22 : intensité = 1.2 (contraste accru de 20%)
             * - Crée des hotspots plus marqués au zoom élevé
             */
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 0,       // Faible intensité au zoom faible
                22, 1.2     // Intensité accrue au zoom élevé
            ],
            
            /**
             * COULEUR DU DÉGRADÉ selon la densité
             * Expression 'interpolate' ['linear'] basée sur ['heatmap-density']
             * ['heatmap-density'] = valeur calculée de 0 à 1 (pas le zoom !)  
             * 
             * Dégradé 7 points :
             * 0.0 → Transparent bleu (0% densité)
             * 0.1 → Bleu royal (10% densité)
             * 0.3 → Cyan (30% densité)
             * 0.5 → Vert citron (50% densité)
             * 0.7 → Jaune (70% densité)
             * 1.0 → Rouge (100% densité - hotspot)
             * 
             * Progression : froid → chaud (bleu → rouge)
             */
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],            // Valeur d'entrée : densité calculée (0-1)
                0, 'rgba(0, 0, 255, 0)',        // Densité 0% : transparent
                0.1, 'royalblue',               // Densité 10% : bleu foncé
                0.3, 'cyan',                    // Densité 30% : cyan
                0.5, 'lime',                    // Densité 50% : vert citron
                0.7, 'yellow',                  // Densité 70% : jaune
                1, 'red'                        // Densité 100% : rouge (hotspot)
            ],
            
            /**
             * RAYON D'INFLUENCE de chaque point sur la heatmap
             * Distance en pixels ou mètres (selon unités)
             * 
             * Effet zoom :
             * - Zoom 0 : rayon = 2px (points très serrés)
             * - Zoom 22 : rayon = 20px (points très dispersés)
             * - Zoom intermédiaire : interpolation lisse
             * 
             * Rayon plus grand = zones de chaleur plus grandes et fusionnées
             */
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,       // Zoom petit = rayon petit (détails fine)
                22, 20      // Zoom grand = rayon grand (hotspots larges)
            ],
            
            /**
             * OPACITÉ GLOBALE de la heatmap
             * Expression 'interpolate' basée sur le zoom
             * 
             * Effet zoom :
             * - Zoom 7 : opacité = 1.0 (100% opaque)
             * - Zoom 9+ : opacité = 0.8 (80% = 20% transparent)
             * - Entre 7 et 9 : transition lisse
             * 
             * Réduit le "bruit" visuel au zoom très élevé
             */
            'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 1,       // Zoom 7 : totalement visible
                9, 0.8      // Zoom 9+ : légèrement transparent
            ]
        }
    });
    
    /**
     * Enregistre la couche au panneau de contrôle
     * @see registerLayerControl
     */
    registerLayerControl('heatmap', 'Heatmap');
}