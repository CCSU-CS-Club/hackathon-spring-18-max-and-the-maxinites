import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import fontAwesome from '@fortawesome/fontawesome'
import {faBars} from '@fortawesome/fontawesome-free-solid'
import MapCont from './Map'

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
			<div className={'menu-modal' + (this.state.hideMenu ? ' menu-modal-hidden' : '') } onClick={this.toggleMenu}>
				<div className={'menu' + (this.state.hideMenu ? ' menu-hidden' : '') }>
					<ul className={'menu-list'}>
						<li className={'menu-title'}>RunAway</li>
						<li className={'menu-options'}>Option 1</li>
						<li className={'menu-options'}>Option 2</li>
					</ul>
				</div>
			</div>
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
