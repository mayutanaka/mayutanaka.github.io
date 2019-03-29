mapboxgl.accessToken = 'pk.eyJ1IjoibWF5dXRhbmFrYSIsImEiOiJjajhieGJ4N3gwMzgzMzNtb2tmMDFiMHJlIn0.qCJLeV-KUvxpAO38a9dPtA';

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mayutanaka/cja3e5dhr1m2p2spjp5e7s9pp' // replace this with your style URL
});

var radius = 0.012;

function pointOnCircle(angle) {
return {
"type": "Point",
"coordinates": [
Math.cos(angle) * radius + -118.2489502429962,
Math.sin(angle) * radius + 34.05488610928646
]
};
}

map.on('load', function() {
  // the rest of the code will go in here
map.on('mousemove', function(e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['the-grand', 'transit-subway', 'transit-bike', 'transit-bus', 'groceries', 'parks', 'museums']
  });

  if (features.length > 0) {
    innerHTML = '<h3><strong>' + features[0].properties.name + '</strong></h3>' +
    '<p><strong>Type: </strong><em>' + features[0].properties.type + '</em></p>' +
    '<p><strong>Distance: </strong><em>' + features[0].properties.distance + '</em></p>';
    switch (features[0].properties.type) {
      case 'transit':
        document.getElementById('pd').innerHTML = innerHTML +
          '<p><strong>Mode: </strong><em>' + features[0].properties["transit-type"] + '</em></p>';
        break;
      case 'museum':
        document.getElementById('pd').innerHTML = innerHTML +
          '<p><strong>Rating: </strong><em>' + features[0].properties.rating+ '</em></p>';
        break;
      case 'park':
        document.getElementById('pd').innerHTML = innerHTML;
        break;
      case 'grocery':
      document.getElementById('pd').innerHTML = innerHTML +
        '<p><strong>Year Built: </strong><em>' + features[0].properties['year-built']+ '</em></p>' +
        '<p><strong>Has Housing? </strong><em>' + features[0].properties["has-housing"]+ '</em></p>';
        break;
      default:
        document.getElementById('pd').innerHTML = innerHTML +
        '<p><strong>Height: </strong><em>' + features[0].properties.stories + ' stories</em></p>';
    }
  } else {
    document.getElementById('pd').innerHTML = '<p>Hover over a point of interest!</p>';
  }
});

map.getCanvas().style.cursor = 'default';

// Add a source and layer displaying a point which will be animated in a circle.
map.addSource('point', {
"type": "geojson",
"data": pointOnCircle(0)
});

map.addLayer({
"id": "point",
"source": "point",
"type": "circle",
"paint": {
"circle-radius": 10,
"circle-color": "#007cbf"
}
});

function animateMarker(timestamp) {
// Update the data to a new position based on the animation timestamp. The
// divisor in the expression `timestamp / 1000` controls the animation speed.
map.getSource('point').setData(pointOnCircle(timestamp / 1000));

// Request the next frame of the animation.
requestAnimationFrame(animateMarker);
}

// Start the animation.
animateMarker(0);

});
