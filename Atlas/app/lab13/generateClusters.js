/**
 * Génère une visualisation de clusters à partir des points aléatoires
 */
function generateClusters() {
    // Supprimer toutes les couches et sources existantes
    removeAllLayersAndSources();
    
    // Ajouter la source des points avec clustering activé
    map.addSource('clusters-source', {
        type: 'geojson',
        data: randomPoints,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
    });
    
    // Couche pour les clusters
    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'clusters-source',
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100, '#f1f075',
                750, '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100, 30,
                750, 40
            ]
        }
    });
    registerLayerControl('clusters', 'Clusters');
    
    // Couche pour les points non-clusterisés
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'clusters-source',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });
    registerLayerControl('unclustered-point', 'Points non clusterisés');
}
