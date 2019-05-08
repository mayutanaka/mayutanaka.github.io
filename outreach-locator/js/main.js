/* ============= Mapbox setup ============== */
mapboxgl.accessToken = 'pk.eyJ1IjoibWF5dXRhbmFrYSIsImEiOiJjajhieGJ4N3gwMzgzMzNtb2tmMDFiMHJlIn0.qCJLeV-KUvxpAO38a9dPtA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mayutanaka/cjuyfpqbc02ae1fny2s8uqcnp',
center: [-85.735,38.21],
zoom:11.4
});

map.addControl(new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
mapboxgl: mapboxgl,
placeholder: "search"
}));

/* ============= Interactive Elements setup ============== */
$("#risk-threshold").slider({
  range: true,
  min: 1,
  max: 10,
  values: [5, 10],
  slide: function(event, ui) {
    $("#threshold").val(ui.values[0]+" - "+ui.values[1]);
  }
});
$("#threshold").val($('#risk-threshold').slider('values', 0)+" - "+$('#risk-threshold').slider('values', 1));
$("#buffer").slider({
  orientation: "horizontal",
  range: "min",
  max: 4,
  value: 2,
  slide: function(event, ui) {
    $("#buffer-text").val((ui.value/4)+" miles");
  }
});
$("#buffer-text").val($('#buffer').slider('value')/4+" miles");

/* ============= Global variables ============== */
var mapOptions, hoverCell, zoomlevel;
var churchesChecked, schoolsChecked = false;
var popup = new mapboxgl.Popup({
  closeButton: false
});
var riskLayers = ["predictions-all","predictions-q1","predictions-q2","predictions-q3","predictions-q4",
                  "predictions-q5","predictions-q6","predictions-q7","predictions-q8","predictions-q9","predictions-q10",
                  "facparks","facschools","faclibraries", "predictions-buffer"];

/* ============= User Interactivity ============== */
$(document).ready(function() {
  $('#exampleModal').modal('show');
  $('#collapseExample').collapse();
});

$('#update-map').click(function() {
  mapOptions = readInput();
  librariesChecked = mapOptions.libraries;
  parksChecked = mapOptions.parks;
  schoolsChecked = mapOptions.schools;
  updateMap();
});

$('#resetbutton').click(function() {
  resetMap();
});
