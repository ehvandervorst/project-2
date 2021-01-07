  // Load in geojson data
  var geoData = "static/data/Demographics.geojson";
  var link = "static/data/nyc_yelp_4_stars_75_percentile_outskirts.geojson";
  
  // Grab data with d3
  d3.json(link, function(data) {
    let man = data.features

    d3.json(geoData, function(data) {
      let demo = data.features

      createMap(man, demo)
    })
  })

  function createMap(man, demo) {

    let yelpMarkers = man.map((feature) =>
      L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],{
        radius: 5,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        onEachFeature: function(feature,layer) {
          layer.bindpopup("<h3>"+"<a href=\""+ feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.name + "</a> </h3> <hr> <h5>Rating " + feature.properties.rating + "</h5>" + "<hr> <h5>" + feature.properties.review_count + "</h5> <hr> <h5>" + feature.properties.categories_list.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '') + "</h5>");
        }
      }),

      
        // onEachFeature: function(feature, layer) {
        //   var popupText = "<h3>"+"<a href=\""+ feature.properties.url + "\""+" target=\"_blank\">" + feature.properties.name + "</a> </h3> <hr> <h5>Rating " + feature.properties.rating + "</h5>" + "<hr> <h5>" + feature.properties.review_count + "</h5> <hr> <h5>" + feature.properties.categories_list.replace(/[`~!@#$%^&*()_|+\-=?;:'".<>\{\}\[\]\\\/]/gi, '') + "</h5>"
        //   layer.bindPopup(popupText);
        //   layer.on('mouseover', function() {layer.openPopup();});
        //   layer.on('mouseout', function() {layer.closePopup();});
        // }
    );

    let restaurants = L.layerGroup(yelpMarkers);
  
    // Create a new choropleth layer
    let neighborhoods = L.choropleth(demo, {
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
        fillOpacity: 0.5},
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<b>Neighborhood:</b> " + feature.properties.ntaname + "<br><b>People per Acre:</b> " + feature.properties.PPA2010 + "<br><b>Population Age 20-29:</b> " + feature.properties.Pop20t29P + "%" + "<br><b>Median Household Income:</b> " + "$" + feature.properties.MdHHIncE);
        }
       
    });

    // Define streetmap and darkmap layers
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
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "Light Map": lightMap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Restaurants: restaurants,
      Demographics: neighborhoods
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [40.696518, -74.014260],
      zoom: 11,
      layers: [streetmap, restaurants]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
    
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = neighborhoods.options.limits;
      var colors = neighborhoods.options.colors;
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
    legend.addTo(myMap);
  }