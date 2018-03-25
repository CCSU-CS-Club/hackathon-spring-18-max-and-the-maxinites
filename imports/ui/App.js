import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import fontAwesome from '@fortawesome/fontawesome'
import {faBars} from '@fortawesome/fontawesome-free-solid'

import MapCont from './Map'
import List from './List'
import './App.css'

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
			<Router>
				<div>
			<div className={'menu-modal' + (this.state.hideMenu ? ' menu-modal-hidden' : '')}  onClick={this.toggleMenu}>
				<div className={'menu' + (this.state.hideMenu ? ' menu-hidden' : '') }>
					<ul className={'menu-list'}>
						<li className={'menu-title'}>RunAway</li>
						<li className='menu-option'><Link to='/map'>Disaster</Link></li>
						<li className='menu-option'><Link to='/list'>Prepare</Link></li>
					</ul>
				</div>
			</div>
			<div className="top-bar">
				<div className="menu-toggle"><FontAwesomeIcon icon="bars"/></div>
				<input className="location-entry" type="text" name="locationField" placeholder="Location"/>
			</div>
			<Route path="/map" component={MapCont}/>
			<Route path="/list" component={List}/>
				</div>
			</Router>
		)
	}

	toggleMenu(){
		this.setState({hideMenu: !this.state.hideMenu});
	}
}

export default App
