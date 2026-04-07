/**
 * Génère une heatmap à partir des points aléatoires
 */
function generateHeatmap() {
    // Supprimer toutes les couches et sources existantes
    removeAllLayersAndSources();
    
    // Ajouter la source des points pour la heatmap
    map.addSource('heatmap-source', {
        type: 'geojson',
        data: randomPoints
    });
    
    // Ajouter la couche heatmap
    map.addLayer({
        id: 'heatmap',
        type: 'heatmap',
        source: 'heatmap-source',
        paint: {
            'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 0,
                22, 1
            ],
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 0,
                22, 1.2
            ],
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(0, 0, 255, 0)',
                0.1, 'royalblue',
                0.3, 'cyan',
                0.5, 'lime',
                0.7, 'yellow',
                1, 'red'
            ],
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,
                22, 20
            ],
            'heatmap-opacity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 1,
                9, 0.8
            ]
        }
    });
    registerLayerControl('heatmap', 'Heatmap');
}