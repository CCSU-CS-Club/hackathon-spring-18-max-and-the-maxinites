// GoogleMapsAPI Key: AIzaSyDK8uA17TfC1LEJ3OIoAYo2CP9VsJXBkSI

var theMap;
var map = {
    initMap: function() {
      map = new google.maps.Map(document.getElementById('theMap'), {
        center: {lat: 41.69, lng: -72.76},
        zoom: 8
      });
    },
    
    
    /**
     * Returns raw text of the provided url
     * @param {type} url
     * @returns {Array|Object}
     */
    request: function(url){ 
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.setRequestHeader("token", "mHTrdLZOjDogXdFffgTmOKAkkEwnodin");
        req.send(null);   
        return req.responseText;        
    },
    
    test: function(){
        var url = getInputText();
        console.log(requestRawTextWithToken(url));
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
        return JSON.parse(request(url));
    },
            
    getTextInput: function(){
        var text = document.input_form.text.value;
        return text;
    }
};