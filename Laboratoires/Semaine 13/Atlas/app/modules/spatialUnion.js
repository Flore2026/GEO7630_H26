/**
 * Compte les points et enrichit chaque polygone avec le nombre de points qu'il contient.
 * @param {FeatureCollection} points - Une collection de points à analyser.
 * @param {FeatureCollection} polygons - Une collection de polygones à enrichir.
 * @returns {FeatureCollection} Une FeatureCollection de polygones avec la propriété pointCount.
 */
function countPointsInPolygons(points, polygons) {
    // Utilise la bibliothèque Turf pour collecter les points dans les polygones
    // La méthode collect retourne une nouvelle FeatureCollection contenant les polygones et les points collectés
    // La propriété polygonIndex est ajoutée aux points pour indiquer à quel polygone ils appartiennent
    // La propriété pointIndex est ajoutée aux polygones pour indiquer quels points leur appartiennent
    const collected = turf.collect(polygons, points, 'polygonIndex', 'pointIndex');
    
    // Parcourt tous les polygones dans la FeatureCollection
    collected.features.forEach((polygonFeature) => {
        // Compte le nombre de points pour chaque polygone
        const pointCount = polygonFeature.properties.pointIndex.length;
        // Ajoute la propriété pointCount à chaque polygone, qui contient le nombre de points qu'il contient
        polygonFeature.properties.pointCount = pointCount;
    });
    
    // Retourne la nouvelle FeatureCollection contenant les polygones et les points collectés, avec les propriétés mises à jour
    return collected;
}