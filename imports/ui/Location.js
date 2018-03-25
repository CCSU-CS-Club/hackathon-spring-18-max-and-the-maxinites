import React from 'react'
import {Polygon, InfoWindow, Marker} from 'google-maps-react'

export class Location extends React.Component{

	constructor(props) {
		super(props)
		this.onPolygonClick = this.onPolygonClick.bind(this)
		this.state = {
			name: props.name,
			paths: props.paths,
			strokeColor: props.strokeColor,
			onClick: props.onClick,
			strokeOpacity: props.strokeOpacity,
			strokeWeight: props.strokeWeight,
			fillColor: props.fillColor,
			fillOpacity: props.fillOpacity,
			position: props.position,
			text: props.text
		}
	}

	render(){
		console.log(this.state.paths)
		return(
			<>
			<Polygon ref={(input)=>{this.props.polygon = input}} onClick={this.onPolygonClick}
				paths={this.state.paths} strokeColor={this.state.strokeColor} strokeOpacity={this.state.strokeOpacity}
				strokeWeight={this.state.strokeWeight} fillColor={this.state.fillColor} fillOpacity={this.state.fillOpacity}/>
				<Marker ref={(input)=>{this.props.marker = input}} name={this.state.name} position={this.state.position} visible={false}/>
				</>
		)
	}

	onPolygonClick(props,polygon,e){
		console.log(polygon)
		this.state.onClick(this.state.marker, this.state.text);
	}

}
