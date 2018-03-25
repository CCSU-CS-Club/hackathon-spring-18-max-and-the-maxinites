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
		this.onTextInput = this.onTextInput.bind(this)
		this.state = {
			hideMenu: true,
			currentLocation: ''
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

	onTextInput(e){
		console.log(e)
		this.setState({currentLocation: e.target.value})
	}
}

export default App
