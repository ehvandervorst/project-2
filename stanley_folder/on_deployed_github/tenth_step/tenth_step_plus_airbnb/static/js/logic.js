

// Adding tile layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var light = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});



// Use this link to get the geojson data.
var link1 = "static/data/movies.geojson";
var link2 = "static/data/nyc_yelp_4_stars_75_percentile_outskirts.geojson";
var link3 = "static/data/Demographics.geojson";
var link4 = "static/data/nyc_crime.geojson";
var link5 = "static/data/airbnb.geojson";


var man = []
var geojsonMarkerOptions = {
  radius: 5,
  fillColor: "#4682B4",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};


var geojsonMarkerOptions2 = {
  radius: 5,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};


var geojsonMarkerOptions3 = {
  radius: 5,
  fillColor: "#fd5c63",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

var movies_list = [{
  location: [40.70435915, -74.01472628],
  name: "Men in Black (1997)",
  description: "Filmed at Battery park"
},
{
  location: [40.7525888, -73.97975564],
  name: "Spider-man (2002)",
  description: "Filmed at Midtown Manhattan"
},
{
  location: [40.72539684, -73.98378432],
  name: "The Godfather Part II (1974)",
  description: "Filmed at 6th St and Ave A, East Village"
}
]



// Grabbing our GeoJSON data..

test_json = []

d3.queue()
	.defer(d3.json, link1)
  .defer(d3.json, link2)
  .defer(d3.json, link3)
  .defer(d3.json, link4)
  .defer(d3.json, link5)
	.await(makeMyMap);

function makeMyMap(error, movies, nyc_yelp, demographics, nyc_crime, airbnb)  {
 
  console.log(airbnb);
  test_json = nyc_crime;

  var heatArray = [];

  for (var i = 0; i < nyc_crime['features'].length; i++) {
    var location1 = nyc_crime['features'][i]['geometry']['coordinates'];

    if (location1) {
      heatArray.push([location1[1], location1[0]]);
    }
  }
  console.log(heatArray);

  var heat = L.heatLayer(heatArray, {
    radius: 44,
    blur: 35
  });

   
  var airbnbGeoJsonMap = L.geoJson(airbnb, {
    pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions3);
    },
    onEachFeature: function (feature, layer) {
      var popupText = "<h5>" + feature.properties.name + "/<h5> <hr> <h5>" + feature.properties.room_type + "</h5> <h5> Neighborhood: " + feature.properties.neighbourhood + "</h5> <h5> Number of Reviews: " + feature.properties.number_of_reviews + "</h5>"
      layer.bindPopup(popupText);
    }

  });
  
  
    var moviesGeoJsonMap = L.geoJson(movies, {
    pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: function (feature, layer) {
      var popupText = "<h5>" + "<a href=\"" + feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.film_year + "</a></h5> <hr> <h5>" + feature.properties.location + "</h5><h5>" + feature.properties.genre + "</h5> <h5>" + feature.properties.plot + "</h5> <h5> Rated: " + feature.properties.rated + " ,     Ratings: " + feature.properties.rating + "<h5>" 
      layer.bindPopup(popupText);
    }

  });

  var moviesGeoJsonMap2 = L.geoJSON(movies, {

    pointToLayer: function (feature, latlng) {
     return L.circleMarker(latlng, geojsonMarkerOptions);
  },
  // onEachFeature: function(feature, layer) {
  //             var popupText = ""<h3>"+"<a href=\""+ man['features'][i]['properties']['url'] + "\""+" target=\"_blank\">" + man['features'][i]['properties']['name'] + "</a> </h3> <hr> <h5>Rating " + man['features'][i]['properties']['rating'] + "</h5>";
  //             layer.bindPopup(popupText); }
  // onEachFeature: onEachFeature
    onEachFeature: function (feature, layer) {
      var popupText = "<h5>" + feature.properties.film_year + "</h5> <hr> <h5>" + feature.properties.location + "</h5><h5>" + feature.properties.genre + "</h5> <h5>" + feature.properties.plot + "</h5> <h5> Rated: " + feature.properties.rated + " ,     Ratings: " + feature.properties.rating + "<h5>" 
    // var popupText = "<h3>"+"<a href=\""+ feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.name +
    // "</a> </h3> <hr> <h5>Rating " + feature.properties.rating + "</h5>" + "<hr> <h5>" + feature.properties.review_count + "</h5> <hr> <h5>" + feature.properties.categories_list.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '') + "</h5>"
      layer.bindPopup(popupText);
      layer.on('mouseover', function() {layer.openPopup();});
    layer.on('mouseout', function() {layer.closePopup();});
  }
  });

  var yelpGeoJsonMap = L.geoJSON(nyc_yelp, {

    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, geojsonMarkerOptions2);
    },
    // onEachFeature: function(feature, layer) {
    //             var popupText = ""<h3>"+"<a href=\""+ man['features'][i]['properties']['url'] + "\""+" target=\"_blank\">" + man['features'][i]['properties']['name'] + "</a> </h3> <hr> <h5>Rating " + man['features'][i]['properties']['rating'] + "</h5>";
    //             layer.bindPopup(popupText); }
    // onEachFeature: onEachFeature
    onEachFeature: function (feature, layer) {
      // var popupText = "<h3>"+"<a href=\""+ feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.name + "</a> </h3> <hr> <h5>Rating " + feature.properties.rating + "</h5>" + "<hr> <h5>" + feature.properties.review_count + "</h5> <hr> <h5>" + feature.properties.categories_list.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '') + "</h5>"
      var popupText = "<h3>"+ feature.properties.name + "</h3> <hr> <h5>Rating " + feature.properties.rating + "</h5>" + "<hr> <h5>" + feature.properties.review_count + "</h5> <hr> <h5>" + feature.properties.categories_list.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '') + "</h5>"


      layer.bindPopup(popupText);
      layer.on('mouseover', function() {layer.openPopup();});
      layer.on('mouseout', function() {layer.closePopup();});
    }
  })


  var demographicsGeoJsonMap = L.choropleth(demographics, {
    // Define what  property in the features to use
    valueProperty: "PPA2010",
    // Set color scale
    scale: ["#ffffb2", "#b10026"],
    // Number of breaks in step range
    steps: 10,
    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#561771",
      weight: 1,
      fillOpacity: 0.5
    },

    //Binding a pop-up to each layer
     onEachFeature: function(feature, layer) {
       layer.bindPopup("<b>Neighborhood:</b> " + feature.properties.ntaname + "<br><b>People per Acre:</b> " + feature.properties.PPA2010 + "<br><b>Population Age 20-29:</b> " + feature.properties.Pop20t29P + "%" + "<br><b>Median Household Income:</b> " + "$" + feature.properties.MdHHIncE);
     }
  })

 // Set up the legend
   var legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
   var div = L.DomUtil.create("div", "info legend");
   var limits = demographicsGeoJsonMap.options.limits;
   var colors = demographicsGeoJsonMap.options.colors;
   var labels = [];

   // Add min & max
   var legendInfo = "<h1>Population Density - Per Acre</h1>" +
     "<div class=\"labels\">" +
       "<div class=\"min\">" + limits[0] + "</div>" +
       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
     "</div>";

   div.innerHTML = legendInfo;

   limits.forEach(function(limit, index) {
     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
   });

   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
   return div;
 };

 // Adding legend to the map

  var baseMaps = {
    StreetMap: streetmap,
    Light: light
  }

  var overlayMaps = {
    movies: moviesGeoJsonMap,
    movies_popup: moviesGeoJsonMap2,
    yelp_popup: yelpGeoJsonMap,
    demographics: demographicsGeoJsonMap, 
    crime: heat,
    airbnb: airbnbGeoJsonMap
 }

    // Creating map object
  var myMap = L.map("map", {
    center: [40.757507, -73.987772],
  zoom: 12,
  layers: [streetmap]
  });

  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  // legend.addTo(myMap);


  myMap.on('overlayadd', function (eventLayer) {
    // Switch to the Population legend...
    if (eventLayer.name === 'demographics') {
        this.removeControl(legend);
        legend.addTo(this);
    } else { // Or switch to the Population Change legend...
        this.removeControl(legend);
    }
  });

  for (var i = 0; i < movies_list.length; i++) {
    var movie_ = movies_list[i];
    L.marker(movie_.location)
     .bindPopup("<h1>" + movie_.name + "</h1> <hr> <h3>" + movie_.description + "</h3>")
     .addTo(myMap);
 
 }
 
  //https://gis.stackexchange.com/questions/176174/toggling-leaflet-legends


};



//   d3.json(link1, function(data) {
//     // Creating a GeoJSON layer with the retrieved data
//     // this beomes blue and then you can style it however which way you need in the other logic files
//     console.log(data);
//     man = data;
//     console.log(man)
//     // .bindPopup("<h3>"+"<a href=\""+ man['features'][i]['properties']['url'] + "\""+" target=\"_blank\">" + man['features'][i]['properties']['name'] + "</a> </h3> <hr> <h5>Rating " + man['features'][i]['properties']['rating'] + "</h5>")
//     var geoJsonMap = L.geoJSON(data, {

//       pointToLayer: function (feature, latlng) {
//       return L.circleMarker(latlng, geojsonMarkerOptions);
//       },
//     // onEachFeature: function(feature, layer) {
//     //             var popupText = ""<h3>"+"<a href=\""+ man['features'][i]['properties']['url'] + "\""+" target=\"_blank\">" + man['features'][i]['properties']['name'] + "</a> </h3> <hr> <h5>Rating " + man['features'][i]['properties']['rating'] + "</h5>";
//     //             layer.bindPopup(popupText); }
//     // onEachFeature: onEachFeature
//       onEachFeature: function (feature, layer) {
//         var popupText = "<h5>" + "<a href=\"" + feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.film_year + "</a></h5> <hr> <h5>" + feature.properties.location + "</h5><h5>" + feature.properties.genre + "</h5> <h5>" + feature.properties.plot + "</h5> <h5> Rated: " + feature.properties.rated + " ,     Ratings: " + feature.properties.rating + "<h5>" 
//       // var popupText = "<h3>"+"<a href=\""+ feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.name +
//       // "</a> </h3> <hr> <h5>Rating " + feature.properties.rating + "</h5>" + "<hr> <h5>" + feature.properties.review_count + "</h5> <hr> <h5>" + feature.properties.categories_list.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '') + "</h5>"
//         layer.bindPopup(popupText);
//         // layer.on('mouseover', function() {layer.openPopup();});
//       // layer.on('mouseout', function() {layer.closePopup();});
//     }

//     var geoJsonMap2 = L.geoJSON(data, {

//   pointToLayer: function (feature, latlng) {
//    return L.circleMarker(latlng, geojsonMarkerOptions);
// },
// // onEachFeature: function(feature, layer) {
// //             var popupText = ""<h3>"+"<a href=\""+ man['features'][i]['properties']['url'] + "\""+" target=\"_blank\">" + man['features'][i]['properties']['name'] + "</a> </h3> <hr> <h5>Rating " + man['features'][i]['properties']['rating'] + "</h5>";
// //             layer.bindPopup(popupText); }
// // onEachFeature: onEachFeature
//   onEachFeature: function (feature, layer) {
//     var popupText = "<h5>" + "<a href=\"" + feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.film_year + "</a></h5> <hr> <h5>" + feature.properties.location + "</h5><h5>" + feature.properties.genre + "</h5> <h5>" + feature.properties.plot + "</h5> <h5> Rated: " + feature.properties.rated + " ,     Ratings: " + feature.properties.rating + "<h5>" 
//   // var popupText = "<h3>"+"<a href=\""+ feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.name +
//   // "</a> </h3> <hr> <h5>Rating " + feature.properties.rating + "</h5>" + "<hr> <h5>" + feature.properties.review_count + "</h5> <hr> <h5>" + feature.properties.categories_list.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '') + "</h5>"
//     layer.bindPopup(popupText);
//     layer.on('mouseover', function() {layer.openPopup();});
//   layer.on('mouseout', function() {layer.closePopup();});
// }
// });
//   });



// var geoJsonMap2 = L.geoJSON(data, {

//   pointToLayer: function (feature, latlng) {
//    return L.circleMarker(latlng, geojsonMarkerOptions);
// },
// // onEachFeature: function(feature, layer) {
// //             var popupText = ""<h3>"+"<a href=\""+ man['features'][i]['properties']['url'] + "\""+" target=\"_blank\">" + man['features'][i]['properties']['name'] + "</a> </h3> <hr> <h5>Rating " + man['features'][i]['properties']['rating'] + "</h5>";
// //             layer.bindPopup(popupText); }
// // onEachFeature: onEachFeature
//   onEachFeature: function (feature, layer) {
//     var popupText = "<h5>" + "<a href=\"" + feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.film_year + "</a></h5> <hr> <h5>" + feature.properties.location + "</h5><h5>" + feature.properties.genre + "</h5> <h5>" + feature.properties.plot + "</h5> <h5> Rated: " + feature.properties.rated + " ,     Ratings: " + feature.properties.rating + "<h5>" 
//   // var popupText = "<h3>"+"<a href=\""+ feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.name +
//   // "</a> </h3> <hr> <h5>Rating " + feature.properties.rating + "</h5>" + "<hr> <h5>" + feature.properties.review_count + "</h5> <hr> <h5>" + feature.properties.categories_list.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '') + "</h5>"
//     layer.bindPopup(popupText);
//     layer.on('mouseover', function() {layer.openPopup();});
//   layer.on('mouseout', function() {layer.closePopup();});
// }
// });


//   var baseMaps = {
//     Light: light
//   }

//   var overlayMaps = {
//     Geojson: geoJsonMap,
//     // Auto: geoJsonMap2
//   }

//     // Creating map object
//   var myMap = L.map("map", {
//     center: [40.757507, -73.987772],
//   zoom: 11,
//   layers: [light]
//   });

//   L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// });


// onEachFeature: function (feature, layer) {
//   layer.bindPopup(feature.properties.NAME);
// }



// function addDataToMap(data, map) {
//   var dataLayer = L.geoJson(data, {
//       onEachFeature: function(feature, layer) {
//           var popupText = "Magnitude: " + feature.properties.mag
//               + "<br>Location: " + feature.properties.place
//               + "<br><a href='" + feature.properties.url + "'>More info</a>";
//           layer.bindPopup(popupText); }
//       });
//   dataLayer.addTo(map);
// }

10026, 10027, 10030, 10037, 10039, 10001, 10011, 10018, 10019, 10020, 10036, 10029, 10035, 10010, 10016, 10017, 10022, 10012, 10013, 10014, 10004, 10005, 10006, 10007, 10038, 10280, 10002, 10003, 10009, 10021, 10028, 10044, 10065, 10075, 10128, 10023, 10024, 10025, 10031, 10032, 10033, 10034, 10040