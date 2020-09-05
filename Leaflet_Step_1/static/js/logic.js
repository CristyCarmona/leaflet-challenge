function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 8,
    id: "light-v10",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create the map object with options
  var map = L.map("map", {
    center: [40.64606, -111.49797],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);

  // Create a legend to display information about our map
  var info = L.control({
    position: "bottomleft"
  });

  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map
  info.addTo(map);

  // Legend
  document.querySelector(".legend").innerHTML = [
    '<div class="container">'+ 
      '<div class="row">'+
        '<div class = "col-1 range1"/></div>'+
        '<div class="col">0-1</div>'+
      '</div>' +
      '<div class="row">'+
        '<div class = "col-1 range2"/></div>'+
        '<div class="col">1-2</div>'+
      '</div>' +
      '<div class="row">'+
        '<div class = "col-1 range3"/></div>'+
        '<div class="col">2-3</div>'+
      '</div>' +
      '<div class="row">'+
        '<div class = "col-1 range4"/></div>'+
        '<div class="col">3-4</div>'+
      '</div>' +
      '<div class="row">'+
        '<div class = "col-1 range5"/></div>'+
        '<div class="col">4-5</div>'+
      '</div>' +
      '<div class="row">'+
        '<div class = "col-1 range6"/></div>'+
        '<div class="col">5+</div>'+
      '</div>' +
    '</div>'
  ].join("");

}

function createMarkers(response) {

    // Pull the "earthquakes" property off of response.data
    var earthquakes = response.features;

    // Initialize an array to hold bike markers
    var earthquakesMarkers = [];

    console.log(earthquakes.length);

    // Loop through the earthquakes array
    for (var index = 0; index < earthquakes.length; index++) {
      var earthquake_coord = earthquakes[index]['geometry']['coordinates'];
      var earthquake_properties = earthquakes[index]['properties'];

      //Marker color according to earthquake magnitude 
      if (earthquake_properties['mag']<1){
        var magnitud_color = "#b7f34d";
      }
      else if (earthquake_properties['mag']<2){
        var magnitud_color = "#e1f34d";
      }
      else if (earthquake_properties['mag']<3){
        var magnitud_color = "#f3db4d";
      }
      else if (earthquake_properties['mag']<4){
        var magnitud_color = "#f3ba4d";
      }
      else if (earthquake_properties['mag']<5){
        var magnitud_color = "#f0a76b";
      }
      else{
        var magnitud_color = "#f06b6b";
      }

      // For each earthquake, create a marker and bind a popup with the earthquake's place and magnitude
      var earthquakeMarker = L.circleMarker([earthquake_coord[1],earthquake_coord[0]],{
        radius: (earthquake_properties['mag']*5),
        color: "#000000",
        weight: 1,
        fillOpacity: 1,
        fillColor: magnitud_color})
        .bindPopup("<h3> Place:" + earthquake_properties['place'] + "<h3><h3>Magnitude: " + earthquake_properties['mag'] + "</h3>");
  
      // Add the marker to the earthquakesMarkers array
      earthquakesMarkers.push(earthquakeMarker);
    }
  
    // Create a layer group made from the earthquakesMarkers array, pass it into the createMap function
    createMap(L.layerGroup(earthquakesMarkers));
  }
  
  
  // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);

  
  