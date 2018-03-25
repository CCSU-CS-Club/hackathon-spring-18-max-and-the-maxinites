/* global data, google */

// GoogleMapsAPI Key: AIzaSyDK8uA17TfC1LEJ3OIoAYo2CP9VsJXBkSI

var theMap;
var mapAction = {
    
    mapVisibles: [],
    
    
    initMap: function() {
      theMap = new google.maps.Map(document.getElementById('theMap'), {
        center: {lat:32.94, lng: -93},
        zoom: 8
      });
      console.log("MAP LOADED");
    },
    
    

    
    test: function() {
        var state = this.getTextInput();
        this.drawAlertAreaByState("moderate", state);
        this.drawAlertAreaByState("severe", state);
    },
    
    /**
     * Computes distance in miles between the lat, lng positions provided
     * @param {type} pos1 (lat, lng) of first position
     * @param {type} pos2 (lat, lng) of second position
     * @returns {Number} distance between the two positions in miles
     */
    distance: function(pos1, pos2){
    //returns distance in miles.
        pos1 = new google.maps.LatLng(JSON.parse(JSON.stringify(pos1)));
        pos2 = new google.maps.LatLng(JSON.parse(JSON.stringify(pos2)));
        var dist = google.maps.geometry.spherical.computeDistanceBetween(pos1, pos2); //in meters
        dist = dist / 1609.34; //convert to miles
        return dist;       
    },
            
    /**
     * Takes user address as a string, makes a call to google's geocoding service
     * returns the JSON object of the resulting call to google's geocoding service
     * which contains the latitude, longitude of the user address, among many 
     * other things.
     * @param {String} address
     * @returns {Array|Object}
     */
    geocode: function(address){
        address = address.replace(" ", "+");
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' 
            + address + '&key=AIzaSyBezkqLyMpXAF9dBb4X5rZeQkyF8Y5_Te4';  
        return JSON.parse(data.requestText(url));  
    },
            
    getTextInput: function(){
        var text = document.input_form.text_input.value;
        return text;
    }, 
        
    drawPolygon: function(weatherFeature){
        console.log("weather feature:");
        console.log(weatherFeature);
        var pts = this.rawToLatLngArr(weatherFeature.geometry.coordinates[0]);
        var properties = weatherFeature.properties;
        console.log(JSON.stringify(pts[0]));
        var pgon = new google.maps.Polygon({
         marker: new google.maps.Marker({
              map: theMap,
              visible: false,
              position: pts[0]
          }),
          center: new google.maps.LatLng(pts[0]),
          paths: pts,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: theMap,
          clickable: true,
          description: properties.description,
          ends: properties.ends,
          eventType: properties.event,
          instruction: properties.instruction          
        });
        pgon.addListener('click', function(){
           var infoString ="";
           if (pgon.eventType != null)
               infoString += "<p>Alert Type: " + pgon.eventType + "<\p>";
           if (pgon.instructions != null)
               infoString += "<p>Instructions: " + pgon.instructions + "<\p>";
           if (pgon.description != null)
               infoString += "<p>Description: " + pgon.description + "<\p>";
           if (pgon.ends != null){
               var endStr = pgon.ends.split("T");
               infoString = "<p>Alert Ends: \nDate:" + endStr[0] + "\nTime: " + endStr[1]  + "<\p>";
            }
           var infowindow = new google.maps.InfoWindow();
           infowindow.setContent(infoString);
           infowindow.open(theMap, pgon.marker);
        });
        return pgon;
    },
    
    drawAlertAreaByState(severity, state){
        var state = this.getTextInput();
        //var alerts = JSON.parse(data.requestText("testData/TXAlerts"));
        var feature, points;
        var alerts = data.severeAlertsByState("severe", state);
        console.log(alerts);
        var polygons = [];
        for (var i = 0; i < alerts.features.length; i++){
            //console.log("in loop: " + i);
            feature = alerts.features[i];
            if (feature.geometry !== null){
                polygons.push(this.drawPolygon(feature));
            }else{
                console.log(feature);
                console.log("GEOMETRY IS NULL!!!!!!!!!!!!!!!!!!!!");
            }
        }
        //this.addToMap(polygons);
    },
    
    /**
     * Called when this weatherFeature's geometry property is null
     * geocodes the location and places marker on the map.
     * @param {type} weatherFeature
     * @returns {undefined}
     */
    addMarkersForAlert: function(weatherFeature){
        var areaDescription = weatherFeature.properties.areaDesc;
        console.log("GEOCODED $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        var geocoded = this.geocode(areaDescription);
        console.log(geocoded);
        var latLng = geocoded.results[0].geometry.location;
        var marker = new google.maps.Marker({
            position: latLng,
            map: theMap
        });
        return marker;
    },
    

    
    rawToLatLngArr: function(arr){
        //console.log(arr);
        var ptArr = [];
        var point;
        for (var i = arr.length-1; i >= 0; i--){
            point = new google.maps.LatLng(arr[i][1], arr[i][0]);
            //console.log(JSON.stringify(point));
            ptArr.push(point);
        }
        //console.log("LatLng array as string:");
        //console.log(JSON.stringify(ptArr));
        return ptArr;
    },
    
    /**
     * removes objects visible on the map as in a queue FIFO
     * @returns {undefined}
     */
    clearOnce: function(){
        var toBeRemoved = this.mapVisibles[0];
        for (var i = 0; i < toBeRemoved.length; i++){
            toBeRemoved[i].clear();
        }
        this.mapVisibles.shift();
    }
};

