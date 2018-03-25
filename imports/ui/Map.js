import React from 'react'
import {Map, Polygon, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'
import data from './utils/DataInterface'

export class MapCont extends  React.Component{

	constructor(props) {
		super(props)
		this.addMarker = this.addMarker.bind(this)
		this.onMarkerClick = this.onMarkerClick.bind(this)
		this.onPolygonClick = this.onPolygonClick.bind(this)
		this.onMapClick = this.onMapClick.bind(this)
		this.onDragEnd = this.onDragEnd.bind(this)
		this.initializeMap = this.initializeMap.bind(this)
		this.geocode = this.geocode.bind(this)
		this.addPolygon = this.addPolygon.bind(this)
		this.drawPolygon = this.drawPolygon.bind(this)
		this.drawAlertAreaByState = this.drawAlertAreaByState.bind(this)
		this.addPolygonForNullPoints = this.addPolygonForNullPoints.bind(this)
		this.getRectangle = this.getRectangle.bind(this)
		this.state = {
			center: {lat:32.94, lng: -93},
			currentLoc: {lat:32.94, lng: -93},
			currentLocation: props.currentLocation,
			activeMarker: new Marker(),
			showingInfoWindow: false,
			infoText: "",
			markers: [],
			polygons: [],
			style: {
				width: '100%',
				height: 'calc(100% - 50px)'
			}
		}
		//this.addMarker('center',this.state.center.lat,this.state.center.lng, true)
		this.initializeMap();
	}

	render(){
		return(
			<Map
				google={this.props.google}
				initialCenter={this.state.center}
				style={this.state.style}
				zoom={8}
				onClick={this.onMapClick}
				onDragend={this.onDragEnd}
			>
				<Marker name={"Current Location"} position={this.state.currentLoc} onClick={this.onMarkerClick} visible={true}/>
				{this.state.polygons.map(el=>(<Marker ref={(marker)=>{this.state.markers[el.name]=marker}} title={el.name}
				position={el.position} visible={false} icon={{url:"/transparent.png"}}/>))}
				{this.state.polygons.map(el=>(<Polygon name={el.name} onClick={this.onPolygonClick}
					paths={el.paths} strokeColor={el.strokeColor} strokeOpacity={el.strokeOpacity}
					strokeWeight={el.strokeWeight} fillColor={el.fillColor} fillOpacity={el.fillOpacity} marker={this.state.markers[el.name]}/>))}
				<InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
					<div
						dangerouslySetInnerHTML={{__html: this.state.infoText}}
					/>
				</InfoWindow>
			</Map>
		)
	}

	onDragEnd(mapProps, map){
		this.setState({center: map.center})
		//var marker = new Marker({map: map, name: "center", location: map.center})
	}

	onMapClick(){
		this.setState({showingInfoWindow: false})
	}

	onMarkerClick(props, marker, e){
		this.setState({activeMarker: marker})
		this.setState({showingInfoWindow: true})
	}

	onPolygonClick(props, poly, e){
		var marker = props.marker.marker
		console.log(props.marker)
		var text = marker.title



		this.setState({activeMarker: marker})
		this.setState({infoText: text})
		this.setState({showingInfoWindow: true})
	}

	addMarker(name, lat, lng, visible){
		var markers = this.state.markers
		markers.push({name: name, position: {lat: lat, lng: lng}, visible: visible})
		this.setState({markers: markers})
	}

	addPolygon(name, points, color){
		var polygons = this.state.polygons
		var latSum = 0.0;
		var lngSum = 0.0;
		points.forEach((point)=>{
			latSum += point.lat;
			lngSum += point.lng;
		})
		position = {lat: latSum/points.length, lng: lngSum/points.length}
		polygons.push({name: name, paths: points, strokeColor: color, strokeOpacity: 0.8, strokeWeight: 2, fillColor: color, fillOpacity: 0.35, position: position})
		this.setState({polygons: polygons})
	}

	geocode(address){
			address = address.replace(" ", "+");
			var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='
					+ address + '&key=AIzaSyBezkqLyMpXAF9dBb4X5rZeQkyF8Y5_Te4';
			//console.log("GEOCODING: " + address);
			var geocode = JSON.parse(data.requestText(url));
			//console.log(geocode);
			return geocode;
	}

	/**
	 * Draws polygon associated with weather event
	 * extracts the lat, lng array
	 * draws polygon on map
	 * adds listener to display storm info on click
	 */
	drawPolygon(weatherFeature){
			//console.log("weather feature:");
			//console.log(weatherFeature);
			var pts;
			if (weatherFeature.points == null)
					pts = this.rawToLatLngArr(weatherFeature.geometry.coordinates[0]);
			else
					pts = weatherFeature.points;
			var properties = weatherFeature.properties;
			//console.log(JSON.stringify(pts[0]));
			var name = ""
			if (properties.areaDesc != undefined) {
				name += "<p><b>Area: </b>" + properties.areaDesc + "</p><br/>"
			}
			if (properties.eventType != undefined) {
				name += "<p><b>Alert Type: </b>" + properties.eventType + "</p><br/>"
			}
			if (properties.description != undefined) {
				name += "<p><b>Description: </b>" + properties.description + "</p><br/>"
			}
			if (properties.instruction != undefined) {
				name += "<p><b>Instructions: </b>" + properties.instruction + "</p><br/>"
			}
			this.addPolygon(name,pts,"#FF0000")
	}

	initializeMap(){
		this.drawAlertAreaByState("severe","")
	}

	/**
	 * Draws polygon associated with weather event
	 * extracts the lat, lng array
	 * draws polygon on map
	 * adds listener to display storm info on click
	 */
	drawAlertAreaByState(severity, state){
			var feature, points;
			var alerts = data.severeAlertsByState("severe", state);
			//console.log(alerts);
			for (var i = 0; i < alerts.features.length; i++){
					//console.log("in loop: " + i);
					feature = alerts.features[i];
					if (feature.geometry !== null){
							feature.points = null;
							this.drawPolygon(feature);
					}else{
							this.addPolygonForNullPoints(feature);
							//console.log(feature);
							//console.log("GEOMETRY IS NULL!!!!!!!!!!!!!!!!!!!!");
					}
			}
			//this.addToMap(polygons);
	}

	/**
	 * Called when this weatherFeature's geometry property is null
	 * geocodes the location and places marker on the map.
	 */
	addPolygonForNullPoints(weatherFeature){
			//console.log("CALLED addPolygonNullPoints");
			var areaDescriptions = weatherFeature.properties.areaDesc.split(";");
			var state = weatherFeature.properties.geocode.UGC[0].substring(0, 2);
			var geocode, searchAddress;

			for (var i = 0; i < areaDescriptions.length; i++){
					//console.log("IN THE LOOP");
					searchAddress = areaDescriptions[i] + " " + state;
					//console.log("the address: " + searchAddress);
					geocode = this.geocode(searchAddress);
					//console.log(geocode);
					if (geocode.status === "OK"){
							//console.log("GEOCODE RESULTS GOOD");
							var centerpt = geocode.results[0].geometry.location;
							var shapepts = this.getRectangle(centerpt);
							//console.log(shapepts);
							weatherFeature.points = shapepts;
							this.drawPolygon(weatherFeature);
					}else{
							//console.log("GEOCODE STATUS IS NOT OK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
					}
			}
		}

			getRectangle(center){
					var latDelta = 0.214;
					var lngDelta = 0.364;
					var x0 = center.lng + lngDelta;
					var y0 = center.lat - latDelta;
					var x1 = center.lng - lngDelta;
					var y1 = center.lat + latDelta;
					var ptArr = [{lat: y0, lng: x0}, {lat: y0, lng: x1}, {lat: y1, lng: x1}, {lat: y1, lng: x0}];
					//console.log("RECTANGLE PTS");
					//console.log(ptArr);
					return ptArr;
			}

			rawToLatLngArr(arr){
					//console.log(arr);
					var ptArr = [];
					var point;
					for (var i = arr.length-1; i >= 0; i--){
							point = {lat: arr[i][1], lng: arr[i][0]};
							//console.log(JSON.stringify(point));
							ptArr.push(point);
					}
					//console.log("LatLng array as string:");
					//console.log(JSON.stringify(ptArr));
					return ptArr;
			}

			/*getUserGeolocation(){
					if (navigator.geolocation){
							navigator.geolocation.getCurrentPosition(function(position) {
									this.userPos = {
										lat: position.coords.latitude,
										lng: position.coords.longitude
									};

									console.log("USER LOCATION: ");
									console.log("lat: " + this.userPos.lat);
									console.log("lng: " + this.userPos.lng);
									return this.userPos;
							}, function(){
									console.log("GEOLOCATION FAILED");
									return null;
							});
					}else{
							console.log("GEOLOCATION NOT AVAILABLE");
							return null;
					}
			}
/*
	var directions = {
		    service: null,
		    renderer: null,
		    rendererOptions: null,
		    isInit: false,
		    start: {"lat" : 29.687908, "lng" : -91.1855975},//{"lat" : 30.2395901, "lng" : -91.75388169999999}, //"St. Martin Louisianna",
		    end: {"lat" : 30.2240897, "lng" : -92.0198427},//"Lafayette Louisianna",

		    init: function(){
		        this.isInit = true;
		        this.service = new google.maps.DirectionsService();
		        this.rendererOptions = {
		            map: theMap,
		            panel: document.getElementById("directions-panel"),
		            hideRouteList: false,
		            preserveViewPort: false
		        };
		        this.renderer = new google.maps.DirectionsRenderer();
		        this.renderer.setOptions(directions.rendererOptions);
		    },

		    request: function(){

		            if (!directions.isInit){
		                this.init();
		            }else{
		                this.clear();
		            }
		            this.renderer.setOptions(this.rendererOptions);

		            this.service.route({
		                travelMode: "DRIVING",
		                origin: this.start,
		                destination: this.end
		            }, this.display);
		            //smap.add([directions]);

		    },
		    display: function(response, status){
		        if (status === 'OK')
		            directions.renderer.setDirections(response);
		        else
		            window.alert('Directions request failed due to ' + status);
		    },

		    clear: function(){
		        this.renderer.setMap(null);
		        this.renderer.setPanel(null);
		    }
		};*/
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyDK8uA17TfC1LEJ3OIoAYo2CP9VsJXBkSI',
	version: 3.31
})(MapCont)
