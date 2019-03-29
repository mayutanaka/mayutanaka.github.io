mapboxgl.accessToken = 'pk.eyJ1IjoibWF5dXRhbmFrYSIsImEiOiJjajhieGJ4N3gwMzgzMzNtb2tmMDFiMHJlIn0.qCJLeV-KUvxpAO38a9dPtA';

var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mayutanaka/cj8bxf89u7q1n2rszfykvqfk0' // replace this with your style URL
});

var places;

map.on('load', function() {
  places = map.querySourceFeatures('composite', {
    'sourceLayer': 'japanTrip-ae6ab3'
  });

  map.on('mousemove', function(e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['japantrip']
  });

  if (features.length > 0) {
  document.getElementById('pd').innerHTML = '<h3><strong>' + features[0].properties.city + '</strong></h3>' +
    '<p><strong>Region: </strong><em>' + features[0].properties.region + '</em></p>' +
    '<p><strong>Duration of Stay: </strong><em>' + features[0].properties.days + ' days</em></p>';
  } else {
    document.getElementById('pd').innerHTML = '<h5><em>Hover over a destination!</em></h5>';
  }
});

map.getCanvas().style.cursor = 'default';
});

var clicks = 0;
document.getElementById('fly').addEventListener('click', function () {
  map.flyTo({
    center: places[clicks % places.length].geometry.coordinates,
    zoom: 10
  });
  clicks+=1;

});
