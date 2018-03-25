import React from 'react'
import {Map, Polygon, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react'
import {Location} from './Location'

export class MapCont extends  React.Component{

	constructor(props) {
		super(props)
		this.addMarker = this.addMarker.bind(this)
		this.onMarkerClick = this.onMarkerClick.bind(this)
		this.onPolygonClick = this.onPolygonClick.bind(this)
		this.onMapClick = this.onMapClick.bind(this)
		this.onDragEnd = this.onDragEnd.bind(this)
		this.state = {
			center: {lat: 35.0, lng: 40.0},
			activeMarker: new Marker(),
			showingInfoWindow: false,
			markers: [],
			polygons: [],
			style: {
				width: '100%',
				height: 'calc(100% - 50px)'
			}
		}
		//this.addMarker('center',this.state.center.lat,this.state.center.lng, true)
		this.addPolygon('javascriptIsMean', [
			{lat: this.state.center.lat + 0.1, lng: this.state.center.lng + 0.1},
			{lat: this.state.center.lat + 0.1, lng: this.state.center.lng - 0.1},
			{lat: this.state.center.lat - 0.1, lng: this.state.center.lng - 0.1},
			{lat: this.state.center.lat - 0.1, lng: this.state.center.lng + 0.1}
		], "#FF0000")
	}

	render(){
		return(
			<Map
				google={this.props.google}
				initialCenter={this.state.center}
				style={this.state.style}
				zoom={10}
				onClick={this.onMapClick}
				onDragend={this.onDragEnd}
			>
				<Marker name={"Current Location"} position={this.state.center} visible={false}/>
				{this.state.polygons.map(el=>(<Location name={el.name} onClick={this.onPolygonClick}
					paths={el.paths} strokeColor={el.strokeColor} strokeOpacity={el.strokeOpacity}
					strokeWeight={el.strokeWeight} fillColor={el.fillColor} fillOpacity={el.fillOpacity} text="hello"/>))}

				<InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
					<div>
						{"Put text in here."}
					</div>
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

	onMarkerClick(props,marker,e){
		this.setState({activeMarker: marker})
		this.setState({showingInfoWindow: true})
	}

	onPolygonClick(marker){
		this.setState({activeMarker: marker})
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
		polygons.push({name: polygons.length, paths: points, strokeColor: color, strokeOpacity: 0.8, strokeWeight: 2, fillColor: color, fillOpacity: 0.35, marker: {map: undefined, name: name, onClick: this.onMarkerClick, position: position, visible: true}})
		this.setState({polygons: polygons})
	}
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyDK8uA17TfC1LEJ3OIoAYo2CP9VsJXBkSI',
	version: 3.31
})(MapCont)
