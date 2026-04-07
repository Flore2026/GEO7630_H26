/**
 * Calcule la moyenne du nombre de points par cellule pour la couche 'joined'.
 * @returns {void}
 */
function dynamicCount() {
    var averagePtsGrid = 0;
    var totalFeatures = 0;

    // Recherche toutes les fonctionnalités de la couche 'joined' actuellement rendue sur la carte
    var features = map.queryRenderedFeatures({ layers: ['joined'] });
    totalFeatures = features.length;

    // Itère sur toutes les fonctionnalités de la couche 'joined'
    features.forEach(function (feature) {
        averagePtsGrid += feature.properties.pointCount;
    });

    // Calcule la moyenne
    var average = averagePtsGrid / totalFeatures;
    document.getElementById('kpi').value = average;
}

/**
 * Met à jour le compteur de fonctionnalités affiché pour la couche 'rdp'.
 * @returns {void}
 */
function featureCount() {
    var features = map.queryRenderedFeatures({ layers: ['rdp'] });
    document.getElementById('featureCount').value = features.length;
}