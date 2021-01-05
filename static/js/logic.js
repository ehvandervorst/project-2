var geoData = "static/data/Demographics.geojson"
var link = "static/data/nyc_yelp_4_stars_75_percentile_outskirts.geojson"

var yelpMarkers = new L.LayerGroup();

d3.json(link, function(geoJson) {
    L.geoJson(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: 5});
        },
        style: function (geoJsonFeature) {
            return {
                fillColor: 'red',
                fillOpacity: 1,
                color: 'black'
            }
        },
        onEachFeature: function (feature,layer) {
            layer.bindPopup("<h3>"+"<a href=\""+ feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.name + "</a> </h3> <hr> <h5>Rating " + feature.properties.rating + "</h5>" + "<hr> <h5>" + feature.properties.review_count + "</h5> <hr> <h5>" + feature.properties.categories_list.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '') + "</h5>");
        }
    }).addTo(yelpMarkers);
});

var neighborhoods = new L.LayerGroup();

d3.json(geoData, function(geoJson) {
    L.choropleth(geoJson, {
      valueProperty: "PPA2010",
      scale: ["#ffffb2", "#b10026"],
      steps: 10,
      mode: "q",
      style: {
        color: "#561771",
        weight: 1,
        fillOpacity: 0.5},
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<b>Neighborhood:</b> " + feature.properties.ntaname + "<br><b>People per Acre:</b> " + feature.properties.PPA2010 + "<br><b>Population Age 20-29:</b> " + feature.properties.Pop20t29P + "%" + "<br><b>Median Household Income:</b> " + "$" + feature.properties.MdHHIncE);
        }  
    }).addTo(neighborhoods);
});

var airbnb = new L.LayerGroup();

d3.csv("static/data/filtered_air_bnb.csv", function(data) {
  data.forEach(function(d){
    coordinates = [d.latitude, d.longitude];
    L.marker(coordinates).bindPopup("<h1>" + d.name + "</h1> <hr> <h3>Price: $" + d.price + "</h3>")
  }).addTo(airbnb);
});

var crime = new L.LayerGroup();

d3.csv("static/data/NYC_crime.csv", function(data){
  var heatArray = [];
  data.forEach(function(d){  
    coordinates = d.coords_list;
    console.log(coordinates);
  });
  var heatMap = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(crime)
});

function createMap() {

    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
  
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/light-v10",
      accessToken: API_KEY
    })
    
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "Light Map": lightMap
    };
  
    var overlayMaps = {
      "Restaurants": restaurants,
      "Demographics": neighborhoods,
      "Airbnb Listings": airbnb,
      "Crime Data": crime
    };
  
    var myMap = L.map("map", {
      center: [40.696518, -74.014260],
      zoom: 11,
      layers: [streetmap, restaurants]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = neighborhoods.options.limits;
        var colors = neighborhoods.options.colors;
        var labels = [];
      
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
      legend.addTo(myMap);
}