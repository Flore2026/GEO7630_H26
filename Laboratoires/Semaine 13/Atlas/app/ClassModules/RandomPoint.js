var points = turf.randomPoint(25, { bbox: [-180, -90, 180, 90] });
// => points

function generateRandomPoints_classe13() {
    return points = turf.randomPoint (25, { bbox: [-180, -90, 180, 90] });
}

function getRandomPoint(map){
    console.log(points)
    map.addSource('randomPoint',{
        type: 'geojson',
        data:points
    });
    map.addLayer({
        id: 'randomPointsLayer',
        type:'circle',
        source: 'randomPoint'
    });
}
