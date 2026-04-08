const myLayers2= "https://glowing-invention-x5657j9pwjqxhpvx6-8801.app.github.dev/cg290808.nbr_sant%C3%A9partri/{z}/{x}/{y}.pbf"

function addvectorTileLayer(map123){
    map123.addSource('arbre',{
        type: 'vector',
        tiles: [myLayers2]
    });

     map123.addLayer({
        id: 'couche',
        type: 'fill',
        source: 'arbre',
        'source-layer': "cg290808.nbr_santépartri",
        
        paint: {
            'fill-color': '#FF0000',
            'fill-opacity': 0.5
        }
    })  
}