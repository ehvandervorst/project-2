// Creating map object
var myMap = L.map("map", {
  center: [40.757507, -73.987772],
  zoom: 11
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var link = "static/data/movies.geojson";



var man = []



var geojsonMarkerOptions = {
  radius: 3,
  fillColor: "#4682B4",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};




// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  // this beomes blue and then you can style it however which way you need in the other logic files
  console.log(data);
  
  man = data;

 console.log(man)



  // .bindPopup("<h3>"+"<a href=\""+ man['features'][i]['properties']['url'] + "\""+" target=\"_blank\">" + man['features'][i]['properties']['name'] + "</a> </h3> <hr> <h5>Rating " + man['features'][i]['properties']['rating'] + "</h5>")
var geoJsonMap = L.geoJSON(data, {

  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, geojsonMarkerOptions);
  },
  // onEachFeature: function(feature, layer) {
  //             var popupText = ""<h3>"+"<a href=\""+ man['features'][i]['properties']['url'] + "\""+" target=\"_blank\">" + man['features'][i]['properties']['name'] + "</a> </h3> <hr> <h5>Rating " + man['features'][i]['properties']['rating'] + "</h5>";
  //             layer.bindPopup(popupText); }
  // onEachFeature: onEachFeature
  onEachFeature: function (feature, layer) {
    var popupText = "<h5>" + "<a href=\"" + feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.film_year + "</a></h5> <hr> <h5>" + feature.properties.location + "</h5><h5>" + feature.properties.genre + "</h5> <h5>" + feature.properties.plot + "</h5> <h5> Rated: " + feature.properties.rated + " ,     Ratings: " + feature.properties.rating + "<h5>" 
    // var popupText = "<h3>"+"<a href=\""+ feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.name +
    // "</a> </h3> <hr> <h5>Rating " + feature.properties.rating + "</h5>" + "<hr> <h5>" + feature.properties.review_count + "</h5> <hr> <h5>" + feature.properties.categories_list.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '') + "</h5>"
    layer.bindPopup(popupText);
    layer.on('mouseover', function() {layer.openPopup();});
    // layer.on('mouseout', function() {layer.closePopup();});
  }
}).addTo(myMap);

});


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