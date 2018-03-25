import React from 'react'
import {Map, GoogleApiWrapper} from 'google-maps-react'

export class MapCont extends  React.Component{
	render(){
		return(
			<Map google={this.props.google}/>
		)
	}
}

export default GoogleApiWrapper({
	apiKey: 'AIzaSyDK8uA17TfC1LEJ3OIoAYo2CP9VsJXBkSI',
	version: 3.31
})(MapCont)
