/**
 * Génère une visualisation 2.5D avec extrusion basée sur le nombre de points
 */
function generateExtrusion() {
    // Vérifier si la union existe, sinon l'union doit être créée en premier
    if (!map.getLayer('union')) {
        dissolver();
    }
    
    // Ajouter une couche d'extrusion 3D basée sur les propriétés des géometries
    if (!map.getLayer('extrusion')) {
        map.addLayer({
            id: 'extrusion',
            type: 'fill-extrusion',
            source: 'union-source',
            paint: {
                'fill-extrusion-color': '#627BC1',
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15, 0,
                    15.05, ['get', 'extrusion-height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15, 0,
                    15.05, ['get', 'extrusion-base']
                ],
                'fill-extrusion-opacity': 0.6
            }
        }, 'water');
        registerLayerControl('extrusion', '2.5D extrusion');
    }
}