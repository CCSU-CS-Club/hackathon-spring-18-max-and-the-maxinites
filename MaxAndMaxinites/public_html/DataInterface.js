var data = {

    getNationalAlerts: function(){
        var alerts = this.request("https://api.weather.gov/alerts/active");
        console.log("National Alerts:");
        //alerts.replace("@", "");
        console.log(JSON.parse(alerts));
        return alerts;
    },
    
    request: function(url){ 
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send(null);   
        return req.responseText;        
    }
};
