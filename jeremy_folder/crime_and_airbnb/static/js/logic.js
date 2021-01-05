// Create a map object
var myMap = L.map("map", {
  center: [40.71, -74.01],
   zoom: 20
});
  
  // Add a tile layer
 L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// console.log(dataset.features.length);
// // Loop through the dataset array and create one marker for each city, bind a popup containing its name and population add it to the map
// for (var i = 0; i < dataset.features.length; i++) {

//   var city = dataset.features[i];
//   L.marker(city.geometry.coordinates)
//    .bindPopup("<h1>" + city.properties.name + "</h1> <hr> <h3>Price: $" + city.properties.price + "</h3>")
//    .addTo(myMap);
// }

d3.csv("static/data/filtered_air_bnb.csv", function(data){
  data.forEach(function(d){
    coordinates = [d.latitude, d.longitude];
    L.marker(coordinates).bindPopup("<h1>" + d.name + "</h1> <hr> <h3>Price: $" + d.price + "</h3>").addTo(myMap);
  });
});

d3.csv("static/data/NYC_crime.csv", function(data){
  var heatArray = [];
  data.forEach(function(d){
    
    //coordinates = d.Lat_Lon;
    latitude = d.latitude;
    longitude = d.longitude;

    if(latitude && longitude){
       heatArray.push([latitude, longitude]);
    }
  });

  var heatMap = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap);

});