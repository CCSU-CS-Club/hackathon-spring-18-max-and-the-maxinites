import React from 'react'
import Map from './Map'
import googleMaps from '@google/maps'

class App extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			googleMapsClient: googleMaps.createClient({
				key: 'AIzaSyDK8uA17TfC1LEJ3OIoAYo2CP9VsJXBkSI'
			})
		}
	}
	render(){
		return(
			<Map/>
		)
	}
}

export default App
