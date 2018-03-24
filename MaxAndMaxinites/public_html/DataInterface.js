var data = {

    getNationalAlerts: function(){
        var alerts = request("https://api.weather.gov/alerts/active");
        console.log("National Alerts:");
        console.log(alerts);
        return alerts;
    },
    
    
    request: function(url){ 
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send(null);   
        return JSON.parse(req.responseText);        
    }
};
