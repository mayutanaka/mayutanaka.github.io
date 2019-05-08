/* ============= Helper Functions ============== */
// Compile inputs from sidebar into a dictionary.
var readInput = function() {
  var inputs = {
    riskLow : $('#risk-threshold').slider('values', 0),
    riskHigh : $('#risk-threshold').slider('values', 1),
    schools : $('#schools').change(function() { $(this).val($(this).is(':checked')); }).change().val()=='true',
    libraries : $('#libraries').change(function() { $(this).val($(this).is(':checked')); }).change().val()=='true',
    parks : $('#parks').change(function() { $(this).val($(this).is(':checked')); }).change().val()=='true',
    buffer : $("#buffer").slider('option', 'value')/4
  };
  return inputs;
}

// When the checkbox for an option is selected, that layer will be shown on the map.
var addOption = function(checkedTrue, layerName) {
  if(checkedTrue) {
    map.setLayoutProperty(layerName, 'visibility', "visible");
  }
};

// Create a bounding box based on the buffer.
var bufferBox = function(point) {
  var radius = mapOptions.buffer/69;
  var sw = map.project([point.lng-radius, point.lat-radius]);
  var ne = map.project([point.lng+radius, point.lat+radius]);
  return [[sw.x,sw.y], [ne.x,ne.y]];
}

// Visualize grids within buffer box.
var showBuffer = function(bbox) {
  var cellsInBuffer = map.queryRenderedFeatures(bbox, {layers: ['predictions-outline']});
  var totalPop = 0;
  var filter = cellsInBuffer.reduce(function(selectSet, cell) {
    selectSet.push(cell.properties.uniqueID);
    totalPop+=cell.properties.TotalPop;
    return selectSet;
  }, ['in', 'uniqueID']);
  map.setFilter("predictions-buffer", filter);
  map.setLayoutProperty('predictions-buffer', 'visibility', "visible");
  document.getElementById('impact-box').innerHTML = "<h4>Impact within "+mapOptions.buffer+" miles:</h4><em>"+Math.round(totalPop)+" people</em>";
  $('#impact-box').css('display','block');
}

// Hovering over a location shows you information about that point.
var hoverOptions = function(checkedTrue, layerName, e) {
  if (checkedTrue) {
    var locations = map.queryRenderedFeatures(e.point, { layers: [layerName] });

    var type;
    switch(layerName) {
      case 'facschools':
        type='School'
        break;
      case 'facparks':
        type='Park';
        break;
      default:
        type='Library';
    }

    if (locations.length>0) {
      popup.setLngLat(e.lngLat)
      .setHTML("<b>Facility type:</b> "+type+"<br><b>Name:</b> "+locations[0].properties.FACNAME+'<br><b>Address:</b> '
                +locations[0].properties.ADDRESS+"<br><center><em>click to select</em></center>")
      .addTo(map);

      map.on('click', function(e) {
        var facilities = map.queryRenderedFeatures(e.point, { layers: [layerName] });
        if (!facilities.length) {
          $('#impact-box').css('display','none');
          return;
        }
        map.setFilter("predictions-buffer", ['in','uniqueID','']);
        map.setLayoutProperty('predictions-buffer', 'visibility', "none");
        map.flyTo({center:e.lngLat, zoom:zoomlevel});
        showBuffer(bufferBox(e.lngLat));
      });
    }

    map.on('mouseleave', layerName, function(){
      popup.remove();
    });
  }
};

// Include risk category layers within user-defined threshold.
// Highlight hover functionality from: https://docs.mapbox.com/mapbox-gl-js/example/query-similar-features/
var includeRisk = function() {
  if(mapOptions) {
    var include = mapOptions.riskLow;
    while(include <= mapOptions.riskHigh) {
      map.setLayoutProperty(riskLayers[include], 'visibility', "visible");
      include++;
    }
  }
}

// Reset map to just fishnet outline.
var resetMap = function() {
  popup.remove();
  riskLayers.forEach(function(layer) {
    map.setLayoutProperty(layer, 'visibility', "none");
  });
  map.setCenter([-85.735,38.21]);
  map.setZoom(11.4);
  $('#impact-box').css('display','none');
}

// Updates the map based on user input when the Update Map button is clicked.
var updateMap = function() {
  resetMap();
  map.getCanvas().style.cursor = 'default';
  includeRisk();

  addOption(librariesChecked, "faclibraries");
  addOption(parksChecked, "facparks");
  addOption(schoolsChecked, "facschools");

  switch (mapOptions.buffer) {
    case 0:
      zoomlevel = 11.4;
      break;
    case 0.25:
      zoomlevel = 15.25;
      break;
    case 0.5:
      zoomlevel = 14.45;
      break;
    case 0.75:
      zoomlevel = 14;
      break;
    default:
      zoomlevel = 13.6;
  }

  var riskCatHover = 0;
  map.on('mousemove', function(e) {
    hoverOptions(librariesChecked, "faclibraries", e);
    hoverOptions(parksChecked, "facparks", e);
    hoverOptions(schoolsChecked, "facschools", e);

    var includedLayers = riskLayers.slice(mapOptions.riskLow, mapOptions.riskHigh+1);
    includedLayers.push("predictions-buffer");
    var gridcells = map.queryRenderedFeatures(e.point, { layers: includedLayers });
    if (gridcells.length>0) {
      $('.info-overlay').css('display','table');
      if (riskCatHover != gridcells[0].properties.quantile) {
          map.setPaintProperty(riskLayers[riskCatHover], 'fill-opacity', 0.5);
          riskCatHover = gridcells[0].properties.quantile;
      }
      var latentRisk = Math.round(gridcells[0].properties.predEnsemble*100)/100;
      var distElec = Math.round(gridcells[0].properties['dist.elec']);
      var wall;
      switch(gridcells[0].properties.WALL_TYPE) {
        case '1':
          wall='Frame';
          break;
        case '2':
          wall='Brick';
          break;
        default:
          wall='Other';
      }
      document.getElementById('info-box').innerHTML = '<h4 class="center title">IN THIS GRID CELL</h4>'+
                                                      '<b>Local risk</b>'+
                                                      '<ul><li>Latent risk: <em>'+latentRisk+' fires</em></li>'+
                                                      '<li>Risk category: <em>'+riskCatHover+'</em></li>'+
                                                      '<li>Past events: <em>'+gridcells[0].properties.countFire+' fires</em></li></ul>'+
                                                      '<b>Local values of top 3 predictors</b>'+
                                                      '<ul><li>Median household income: <em>$'+gridcells[0].properties.MedHHInc+'</em></li>'+
                                                      '<li>Majority wall type: <em>'+wall+'</em></li>'+
                                                      '<li>Distance to nearest electric permit: <em>'+distElec+' ft</em></li></ul>';
      map.setPaintProperty(riskLayers[riskCatHover], 'fill-opacity', 1);
    } else {
      $('.info-overlay').css('display','none');
    }
  });
}
