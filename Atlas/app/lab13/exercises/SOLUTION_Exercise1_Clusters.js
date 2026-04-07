/**
 * SOLUTION EXERCICE 1 - Clusters (Réponses Complètes)
 * =====================================================
 * Ceci est la version COMPLÉTÉE de Exercise1_Clusters.js
 * À utiliser pour vérifier votre travail ou si vous êtes bloqué
 * 
 * Pour utiliser cette solution :
 * 1. Copiez le code complet ci-dessous
 * 2. Ouvrez la console du navigateur (F12)
 * 3. Collez le code
 * 4. Appelez : generateClusters()
 * 
 * La visualisation doit apparaître sur la carte avec :
 * ✓ Clusters colorés par densité
 * ✓ Points individuels au zoom élevé
 * ✓ Deux entrées dans le panneau de contrôle
 */

function generateClusters() {
    // Nettoyage de la carte
    removeAllLayersAndSources();
    
    /**
     * Source GeoJSON avec clustering
     * - type: 'geojson' (type de source pour données GeoJSON)
     * - data: randomPoints (variable globale contenant les points)
     * - cluster: true (active le clustering)
     * - clusterMaxZoom: 14 (zoom jusqu'où les clusters apparaissent)
     * - clusterRadius: 50 (rayon de groupement en pixels)
     */
    map.addSource('clusters-source', {
        type: 'geojson',        // RÉPONSE: 'geojson'
        data: randomPoints,     // RÉPONSE: randomPoints
        cluster: true,          // RÉPONSE: true
        clusterMaxZoom: 14,     // RÉPONSE: 14
        clusterRadius: 50       // RÉPONSE: 50
    });
    
    /**
     * Couche des CLUSTERS (cercles groupés)
     * Utilise expressions 'step' pour graduer couleur et taille selon la densité
     */
    map.addLayer({
        id: 'clusters',
        type: 'circle',          // RÉPONSE TODO_0: 'circle'
        source: 'clusters-source', // RÉPONSE TODO_0.1: 'clusters-source'
        filter: ['has', 'point_count'],
        paint: {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',      // RÉPONSE TODO_6: Défaut (0-99 points) - Cyan
                100, '#f1f075', // RÉPONSE TODO_7,8: À partir de 100 points - Jaune
                750, '#f28cb1'  // RÉPONSE TODO_9,10: À partir de 750 points - Rose
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,             // RÉPONSE TODO_11: Rayon défaut (0-99 points) - 20px
                100, 30,        // RÉPONSE TODO_12,13: À partir de 100 points - 30px
                750, 40         // RÉPONSE TODO_14,15: À partir de 750 points - 40px
            ]
        }
    });
    registerLayerControl('clusters', 'Clusters');
    
    /**
     * Couche des POINTS NON-CLUSTERISÉS
     * Visibles au zoom élevé quand les clusters se divisent
     */
    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'clusters-source',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',      // RÉPONSE TODO_16: Bleu eau
            'circle-radius': 4,             // RÉPONSE TODO_17: 4px
            'circle-stroke-width': 1,       // RÉPONSE TODO_18: 1px
            'circle-stroke-color': '#fff'   // RÉPONSE TODO_19: Blanc
        }
    });
    registerLayerControl('unclustered-point', 'Points non clusterisés');
}

console.log('✅ Solution Exercise1_Clusters chargée');
console.log('Appelez: generateClusters() pour tester');
