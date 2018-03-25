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
        //this.drawAlertAreaByState("moderate", state);
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
        console.log("GEOCODING: " + address);
        var geocode = JSON.parse(data.requestText(url));
        console.log(geocode);
        return geocode; 
    },
            
    getTextInput: function(){
        var text = document.input_form.text_input.value;
        return text;
    }, 
        
    /**
     * Draws polygon associated with weather event
     * extracts the lat, lng array
     * draws polygon on map
     * adds listener to display storm info on click
     * @param {type} weatherFeature: single element from raw storm data array
     * @returns {mapAction.drawPolygon.pgon|google.maps.Polygon}
     */
    drawPolygon: function(weatherFeature){
        console.log("weather feature:");
        console.log(weatherFeature);
        var pts;
        if (weatherFeature.geometry != null)
            pts = this.rawToLatLngArr(weatherFeature.geometry.coordinates);
        else
            pts = weatherFeature.points;
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
               infoString += "<p><b>Alert Type:</b>" + pgon.eventType + "</p>";
           if (pgon.instructions != null)
               infoString += "<p><b>Instructions:</b>" + pgon.instructions + "</p>";
           if (pgon.description != null)
               infoString += "<p><b>Description:</b>" + pgon.description + "</p>";
           if (pgon.ends != null){
               var endStr = pgon.ends.split("T");
               infoString = "<p><b>Alert Ends:</b> \nDate:" + endStr[0] + "\nTime: " + endStr[1]  + "</p>";
            }
           var infowindow = new google.maps.InfoWindow();
           infowindow.setContent(infoString);
           infowindow.open(theMap, pgon.marker);
        });
        return pgon;
    },
    
    /**
     * 
     * @param {type} severity
     * @param {type} state
     * @returns {undefined}\
     */
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
                feature.points = null;
                //this.drawPolygon(feature);
            }else{
                this.addPolygonForNullPoints(feature);
                //console.log(feature);
                //console.log("GEOMETRY IS NULL!!!!!!!!!!!!!!!!!!!!");
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
    addPolygonForNullPoints: function(weatherFeature){
        console.log("CALLED addPolygonNullPoints");
        var areaDescriptions = weatherFeature.properties.areaDesc.split(";");
        var state = weatherFeature.properties.geocode.UGC[0].substring(0, 2);
        var geocode, searchAddress;
        
        for (var i = 0; i < areaDescriptions.length; i++){
            console.log("IN THE LOOP");
            searchAddress = areaDescriptions[i] + " " + state;
            console.log("the address: " + searchAddress);
            geocode = this.geocode(searchAddress);
            //console.log(geocode);
            if (geocode.status === "OK"){
                console.log("GEOCODE RESULTS GOOD");
                var vport =  geocode.results[0].geometry.viewport;
                var points = [vport.northeast, vport.southwest];
                var shapepts = this.getRectangle(points);
                console.log(shapepts);
                weatherFeature.points = shapepts;
                this.drawPolygon(weatherFeature);
            }else{
                console.log("GEOCODE STATUS IS NOT OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            }            
        }
        /*
        
        
        geocodes.push({geo: this.geocode(areaDescriptions[i] + " " + state)});
        console.log("GEOCODED $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(geocodes);
        var points = [];
        for (i = 0; i < geocodes.length; i++){
            if (geocodes[i].geo.status === "OK"){
                console.log(geocodes[i].geo.results[0].geometry)
                const { viewport, bounds, location} = geocodes[i].geo.results[0].geometry;
                if(bounds){
                    const {northeast, southwest} = bounds                
                    points.push(northeast);
                    points.push(southwest);
                }    
                //else
                   //points.push(location)
                console.log(viewport);
            }
        
        },
        weatherFeature.points = points;
        console.log("POINTS: " + JSON.stringify(points));
        this.drawPolygon(weatherFeature);
        
        console.log(geocoded);
        var latLng = geocoded.results[0].geometry.location;
        var marker = new google.maps.Marker({
            position: latLng,
            map: theMap
        });
        return marker;
        */
    },
    
    getRectangle: function(corners){
        var x0 = corners[0].lng;
        var y0 = corners[0].lat;
        var x1 = corners[1].lng;
        var y1 = corners[1].lat;
        var ptArr = [{lat: y0, lng: x0}, {lat: y0, lng: x1}, {lat: y1, lng: x1}, {lat: y1, lng: x0}];
        console.log("RECTANGLE PTS");
        console.log(ptArr);
        return ptArr;
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
    
  
};

