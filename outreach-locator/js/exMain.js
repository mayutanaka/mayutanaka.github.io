var map = L.map('map', {
  center: [39.952539, -75.163555],
  zoom: 13
});


var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


//var hexgrid= "https://raw.githubusercontent.com/zhaoanbei/practicum_data/master/newpracticum.geojson";
//var hexgrid= "https://raw.githubusercontent.com/zhaoanbei/practicum_data/master/pred426.geojson";
var hexgrid="https://raw.githubusercontent.com/zhaoanbei/practicum_data/master/pred0430.geojson";
var Boundary ="https://gist.githubusercontent.com/anonymous/eb5a6386acba87e14f8f4262cb4d0488/raw/7d073e2bab2e0a2cb55e1b19e0b9439bc833c886/boundary.json";
var ZoomAddress=null;
var hexlayer;
var citybdry;

var zip=null;
var cityboundary;

var setview = function(){
  map.setView([40.000, -75.1090],11);
};

function costbenefitColor(d) {
      d = Number(d);
    return  d > 5000   ? '#f46d43' :
            d > 0   ?  '#fee090' :
            d > (-10000)    ? '#e0f3f8' :
            d > (-12000)   ? '#abd9e9' :
            d > (-14000)   ? '#74add1' :
                        '#4575b4';
}


function Style_default(feature) {
    return {
    fillColor:costbenefitColor(parseInt(feature.properties.costben15)),
    color: "#828A8F",
    weight: 0.1,
    opacity: 0.3,
    fillOpacity: 0.6
  };
}

$(document).ready(function() {
   $.ajax(hexgrid).done(function(data) {
     var parsedData = JSON.parse(data);
 hexlayer =L.geoJson(parsedData, {
                style: Style_default,
               }).addTo(map);
 hexlayer.eachLayer(defaultFunction);
 $("#myModal").modal('show');
});
});

//function numdocks(){
  var slider = document.getElementById('myRange');
  var output = document.getElementById("outputRange");
  output.innerHTML = slider.value;
  slider.oninput = function() {
  output.innerHTML = this.value;
  };

  slider.addEventListener('input', function(e) {
    dock = document.getElementById('myRange').value;
    var count = "pred" + dock;
    var cost = "cost" + dock;
    var balance = "costben"+ dock;
    console.log(balance);
    console.log(cost);
    console.log(count);

    map.removeLayer(hexlayer);
    hideResults();

    function Stylecostbenefit(feature) {
        return {
        fillColor:costbenefitColor(parseInt(feature.properties[balance])),
        color: "#828A8F",
        weight: 0.2,
        opacity: 0.3,
        fillOpacity: 0.6
      };
    }

     var addmap = function(){
      $(document).ready(function() {
       $.ajax(hexgrid).done(function(data) {
           var parsedData = JSON.parse(data);
           hexlayer =L.geoJson(parsedData, {
                     style: Stylecostbenefit,
                     }).addTo(map);
       hexlayer.eachLayer(eachFeatureFunction);
      });
      });
    };
    addmap();
    //  var City =function(){
    //    $(document).ready(function() {
    //       $.ajax(Boundary).done(function(data) {
    //         var parsedData = JSON.parse(data);
    //     citybdry=L.geoJson(parsedData, {
    //                    style: myStyle,
    //                   }).addTo(map);
        //layerone.eachLayer(eachFeatureFunction);
    //    });
    //    });
          //  };
  //    City();
  //   alert(choice);
  var eachFeatureFunction = function(layer) {
    layer.on('click', function (event) {
          console.log(5);
          $('#tripcount-num').text(layer.feature.properties[count]);
          $('#cost-num').text("$"+ layer.feature.properties[cost]);
          $('#cost-benefit-num').text("$"+layer.feature.properties[balance]);
          $('#population-num').text(layer.feature.properties.pop);
          $('#median-age-num').text(layer.feature.properties.age);
          $('#medincome-num').text("$"+ layer.feature.properties.income);
          $('#dis-CBD-num').text(parseInt(layer.feature.properties.dis_cbd) + " ft");
          $('#dis-septa-num').text(parseInt(layer.feature.properties.dis_sub) + " ft");
          $('#dis-crime-num').text(parseInt(layer.feature.properties.dis_10crim) + " ft");
        //  map.fitBounds(event.target.getBounds());
        //  console.log(layer.feature.properties.pop);
          showResults();
    });
  };
  });
//}

/*
var sliderFilter=function(){
  var slider = document.getElementById('myRange');
  var output = document.getElementById("outputRange");
  output.innerHTML = slider.value;
  slider.oninput = function() {
    output.innerHTML = this.value;
  };
  BikePoint1.addTo(map);
  slider.addEventListener('input', function(e) {
    rangeMax = document.getElementById('myRange').value;
    map.removeLayer(BikePoint1);
    BikePoint1 = L.geoJson(parsedBike, {
      filter:
          function(feature, layer) {
               return (feature.properties["Trip Count"] <= rangeMax) ;
          },
      style:StyleTripCount,
      pointToLayer: function (point,style) {
        return L.circleMarker([point.geometry.coordinates[1],point.geometry.coordinates[0]], style).bindPopup(Popup(point)).closePopup();
      }
    });
    BikePoint1.addTo(map);
  });
};
*/
//var cartoUserName = 'anbeizhao';
//var cartoVizId = '55548e2c-8b24-423a-be21-52cb98738fcd';

//var hexgrid = 'https://'+cartoUserName+'.carto.com/api/v2/viz/'+cartoVizId+'/viz.json';

/*
cartodb.createLayer(map, hexgrid)
  .on('done', function(layer) {
    layer.addTo(map).on('done', function(layer) {
      console.log("bike");
  }).on('error', function(err) {
    console.log(err);
  });
  });

  var Showinformation = function(feature,layer) {
    layer.on('click', function (event) {
    {
      console.log("I am the destination!");
    }
    });
  };
*/

$('.show-cost-benefit').hide();
$('.show-nbhd-info').hide();
$('#info').hide();
//



//define style
function myStyle(feature) {
        return {
        color: "#969696",
        opacity: 0.7,
        fillOpacity: 0.8};
}



var showResults = function() {
  $('.show-cost-benefit').show();
  $('.show-nbhd-info').show();
  $('#info').show();
};

var hideResults = function() {
  $('.show-cost-benefit').hide();
  $('.show-nbhd-info').hide();
  $('#info').hide();
};

/*
var Showinformation = function(feature,layer) {
layer.on('click', function (event) {
{
console.log("I am the destination!");
//$('#population-num').text(features.properties.Pop);
showResults();
}
});
};
*/

var defaultFunction = function(layer) {
  layer.on('click', function (event) {
    if(document.getElementById('myRange').value==15){
        console.log(2);
        $('#tripcount-num').text(layer.feature.properties.pred15);
        $('#cost-num').text(layer.feature.properties.cost15);
        $('#cost-benefit-num').text("$"+layer.feature.properties.costben15);
        $('#population-num').text(layer.feature.properties.pop);
        $('#median-age-num').text(layer.feature.properties.age);
        $('#medincome-num').text("$"+ layer.feature.properties.income);
        $('#dis-CBD-num').text(parseInt(layer.feature.properties.dis_cbd) + " ft");
        $('#dis-septa-num').text(parseInt(layer.feature.properties.dis_sub) + " ft");
        $('#dis-crime-num').text(parseInt(layer.feature.properties.dis_10crim) + " ft");
      //  map.fitBounds(event.target.getBounds());
      //  console.log(layer.feature.properties.pop);
        showResults();
        }
  });
};

/*
var City =function(){
  $(document).ready(function() {
     $.ajax(Boundary).done(function(data) {
       var parsedData = JSON.parse(data);
   citybdry=L.geoJson(parsedData, {
                  style: myStyle,
                 }).addTo(map);
  //layerone.eachLayer(eachFeatureFunction);
  });
  });
      };
City();
*/


/*
var token="";
var gl = L.mapboxGL({
   accessToken: token,
    style: 'mapbox://styles/anbei/cjgbnw6pr0b432rp5ef5bm9kr'
}).addTo(map);
*/


  /*
cartodb.createVis('map', hexgrid)
  .done(function(vis, layers) {
    // layer 0 is the base layer, layer 1 is cartodb layer
    // when setInteraction is disabled featureOver is triggered
    layers[1].set({ 'interactivity': ['cartodb_id', 'pred20'] });
    layers[1].setInteraction(true);
    layers[1].on('featureClick', function(e, latlng, pos, data) {
      console.log("I love coding");
    });

    // you can get the native map to work with it
  //  var map = vis.getNativeMap();

    // now, perform any operations you need, e.g. assuming map is a L.Map object:
    // map.setZoom(3);
    // map.panTo([50.5, 30.5]);
  });



var showhex = function(){
cartodb.createLayer(map,hexgrid)
  .addTo(map)
  .on('done', function(layer) {
    sublayer = layer.getSubLayer(0);
    sublayer.on('featureClick', function(e, latlng, pos, data) {
    });
  }).on('error', function(err) {
    // console.log(err):
  });
  $('.cartodb-legend-stack').show();
};
showhex();
*/
  /*
var districts = cartodb.createLayer(map, {
    user_name: cartoUserName,
    type: 'cartodb',
    interactivity: true,
    sublayers: [
      {
        sql: "SELECT * FROM bike2"//,
    //    cartocss: 'newpred0418 {line-width: 1; line-color: #0B645E; polygon-fill: #fff; polygon-opacity: 0; line-opacity: 1;}',
    //    interactivity: ['pred20'], // Define properties you want to be available on interaction
     }
    ]
  }).addTo(map)
    .on('done', function(sublayers) {
      console.log("bike");
      // Set interactivity
      sublayers.setInteraction(true);
      // Set up event
      sublayers.on('featureClick',function(e, latlng, pos, data) {
        console.log(data);
      });
    }).on('error', function() {
      console.log("some error occurred");
  });
  */
//$('#second').hide();
//('#third').hide();
//$('#fourth').hide();
//$('#information').hide();
