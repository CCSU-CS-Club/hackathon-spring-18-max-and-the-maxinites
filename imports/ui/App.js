import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import fontAwesome from '@fortawesome/fontawesome'
import {faBars} from '@fortawesome/fontawesome-free-solid'
import MapCont from './Map'
import googleMaps from '@google/maps'

fontAwesome.library.add(faBars)

class App extends React.Component{
	constructor(props){
		super(props)
		this.toggleMenu = this.toggleMenu.bind(this)
		this.state = {
			hideMenu: true
		}
	}

	render(){
		return(
			<>
			<div className={'menu-modal' + (this.state.hideMenu ? ' menu-hidden' : '') } onClick={this.toggleMenu}><div className="menu">{"I'm a menu"}</div></div>
			<div className="top-bar">
				<div className="menu-toggle" onClick={this.toggleMenu}><FontAwesomeIcon icon="bars"/></div>
				<input className="location-entry" type="text" name="locationField" placeholder="Location"/>
			</div>
			<MapCont/>
			</>
		)
	}

	toggleMenu(){
		this.setState({hideMenu: !this.state.hideMenu});
	}
}

export default App
