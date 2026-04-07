/**
 * Génère une visualisation de clusters à partir des points aléatoires.
 * Cette fonction crée une visualisation interactive où les points sont groupés
 * en clusters au zoom faible et se divisent en points individuels au zoom élevé.
 *
 * @function generateClusters
 * @returns {void}
 * 
 * @requires randomPoints {FeatureCollection} - Variable globale contenant les points en GeoJSON
 * @requires map {maplibregl.Map} - Instance globale de la carte MapLibre GL
 * @requires removeAllLayersAndSources() {Function} - Fonction de nettoyage des couches
 * @requires registerLayerControl() {Function} - Fonction d'enregistrement au panneau de contrôle
 *
 * @description
 * Processus :
 * 1. Nettoie toutes les couches et sources existantes avec removeAllLayersAndSources()
 * 2. Crée une source GeoJSON avec le clustering activé
 * 3. Ajoute une couche 'circle' pour les clusters avec:
 *    - Couleur variable selon la densité (3 niveaux: cyan, jaune, rose)
 *    - Rayon variable selon la densité (20, 30 ou 40px)
 *    - Filtre pour afficher uniquement les points avec propriété 'point_count'
 * 4. Ajoute une couche 'circle' pour les points non-clusterisés :
 *    - Cercles bleus de 4px avec contour blanc
 *    - Visibles seulement quand pas de 'point_count' (détails au zoom élevé)
 * 5. Enregistre les deux couches au panneau de contrôle
 */
function generateClusters() {
    /**
     * Supprime tous les layers et sources de la carte
     * @see removeAllLayersAndSources
     */
    removeAllLayersAndSources();
    
    /**
     * Ajoute une source de données GeoJSON avec clustering automatique
     * @method map.addSource
     * @param {string} 'clusters-source' - ID unique de la source
     * @param {Object} config - Configuration de la source
     * @param {string} config.type - Type de source ('geojson')
     * @param {FeatureCollection} config.data - Données GeoJSON (randomPoints)
     * @param {boolean} config.cluster - Active le clustering (true)
     * @param {number} config.clusterMaxZoom - Niveau de zoom max avant clustering (14)
     * @param {number} config.clusterRadius - Rayon de clustering en pixels (50)
     */
    map.addSource('clusters-source', {
        type: 'geojson',
        data: randomPoints,
        cluster: true,          // Active le clustering automatique
        clusterMaxZoom: 14,     // Les points se clusterisent jusqu'au zoom 14
        clusterRadius: 50       // Rayon de 50px autour du point d'ancrage
    });
    
    /**
     * Couche d'affichage des CLUSTERS
     * @method map.addLayer
     * @description
     * - Type 'circle' : affiche les clusters sous forme de cercles
     * - Filtre ['has', 'point_count'] : affiche seulement les clusters (pas les points seuls)
     * - Paint 'circle-color' utilise une expression 'step' pour 3 couleurs selon la densité
     * - Paint 'circle-radius' utilise une expression 'step' pour 3 tailles selon la densité
     * 
     * Expressions 'step' : bascule discrète de valeur selon une condition
     * Format : ['step', [entrée], valeur_défaut, seuil1, valeur1, seuil2, valeur2, ...]
     */
    map.addLayer({
        id: 'clusters',
        type: 'circle',             // Forme : cercle
        source: 'clusters-source',  // Source de données
        filter: ['has', 'point_count'], // Affiche seulement si propriété 'point_count' existe
        paint: {
            /**
             * Couleur basée sur le nombre de points au zoom courant
             * Propriété 'point_count' : auto-générée par le clustering
             * Expression 'step' : 
             *   - Défaut (0-99 points) : cyan #51bbd6
             *   - 100-749 points : jaune #f1f075
             *   - 750+ points : rose #f28cb1
             */
            'circle-color': [
                'step',                    // Type d'expression : changement de marche
                ['get', 'point_count'],    // Valeur d'entrée : nombre de points du cluster
                '#51bbd6',                 // Couleur par défaut (0-99 points) - Cyan
                100, '#f1f075',            // À partir de 100 points - Jaune
                750, '#f28cb1'             // À partir de 750 points - Rose
            ],
            /**
             * Rayon basé sur le nombre de points
             * Même logique que la couleur mais avec des tailles de cercle
             */
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,         // Rayon par défaut (0-99 points) - 20px
                100, 30,    // À partir de 100 points - 30px
                750, 40    // À partir de 750 points - 40px
            ]
        }
    });
    
    /**
     * Enregistre la couche 'clusters' au panneau de contrôle de couches
     * @see registerLayerControl
     */
    registerLayerControl('clusters', 'Clusters');
    
    /**
     * Couche d'affichage des POINTS NON-CLUSTERISÉS
     * @description
     * - Visibles au zoom élevé (quand les clusters se divisent)
     * - Filtre ['!', ['has', 'point_count']] : inverse du cluster (points isolés)
     * - Affichage simple : cercles bleus avec contour blanc
     * 
     * Filtre '!' : opérateur de négation logique (NOT)
     */
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'clusters-source',
        filter: ['!', ['has', 'point_count']],  // Affiche si point_count n'existe PAS
        paint: {
            'circle-color': '#11b4da',          // Bleu eau
            'circle-radius': 4,                 // Petit cercle de 4px
            'circle-stroke-width': 1,           // Contour mince
            'circle-stroke-color': '#fff'       // Contour blanc
        }
    });
    
    /**
     * Enregistre la couche 'unclustered-point' au panneau de contrôle
     * @see registerLayerControl
     */
    registerLayerControl('unclustered-point', 'Points non clusterisés');
}
