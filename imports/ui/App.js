import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import fontAwesome from '@fortawesome/fontawesome'
import {faBars} from '@fortawesome/fontawesome-free-solid'
import Map from './Map'
import googleMaps from '@google/maps'

fontAwesome.library.add(faBars)

class App extends React.Component{
	constructor(props){
		super(props)
		this.toggleMenu = this.toggleMenu.bind(this)
		this.state = {
			googleMapsClient: googleMaps.createClient({
				key: 'AIzaSyDK8uA17TfC1LEJ3OIoAYo2CP9VsJXBkSI'
			}),
			hideMenu: true
		}
	}

	render(){
		return(
			<>
			<div className={'menu-modal' + (this.state.hideMenu ? ' menu-hidden' : '') } onClick={this.toggleMenu}><div className="menu">{"I'm a menu"}</div></div>
			<div className="top-bar">
				<div className="menu-toggle" onClick={this.toggleMenu}><FontAwesomeIcon icon="bars"/></div>
				<input class="location-entry" type="text" name="locationField" placeholder="Location"/>
			</div>
			<Map/>
			</>
		)
	}

	toggleMenu(){
		this.setState({hideMenu: !this.state.hideMenu});
	}
}

export default App
