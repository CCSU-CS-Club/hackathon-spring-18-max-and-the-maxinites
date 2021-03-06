var data = {

  baseUrl: 'https://api.weather.gov/alerts/active',

  getNationalAlerts: function(){
      var url = this.baseUrl;
      console.log("National Alerts:");
      var alerts = JSON.parse(this.requestText("testfiles/TXAlerts.json"));
      console.log(alerts);
      return alerts;
  },

  getCloseAlerts: function(severity){
      var location = mapAction.userPosition;
      console.log(location);
      var url = this.baseUrl + '?point=' + location.lat + "," + location.lng;
      var alerts = JSON.parse(this.requestText(url));
      console.log("Alerts by Location");
      console.log(alerts);
  },

  getSevereAlerts: function(){
      var url = this.baseUrl += '?severity=severe';
      console.log('Severe Alerts');
      var alerts = JSON.parse(this.requestText(url));
      console.log(alerts);
      return alerts;
  },

  severeAlertsByState: function(severity, state){
      var url = this.baseUrl + '?state=' + state + '&Severity=' + severity;
      var alerts = JSON.parse(this.requestText(url));
      return alerts;
  },

  requestText: function(url){
      var req = new XMLHttpRequest();
      req.open('GET', url, false);
      req.send(null);
      return req.responseText;
  }

}

export default data
