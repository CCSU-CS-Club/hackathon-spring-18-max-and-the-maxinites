import React from 'react'
import { render } from 'react-dom'
import { Meteor } from 'meteor/meteor'
import App from '../imports/ui/App'

import './main.html'

Meteor.startup(() => {
	global.Buffer = global.Buffer || require("buffer").Buffer;
	render(<App />, document.getElementById('root'))
})

