import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import {Tasks} from '../api/tasks.js'

class List extends React.Component{
	constructor(props){
		super(props)
		this.state = ({rerender: false})
	}	

	toggleChecked({_id, checked}){
		Tasks.update(_id, {$set: {checked: !checked}})
		this.setState({rerender: !this.state.rerender})
	}

	render(){
		return(<div>{
		 this.props.tasks.map(
			task => (
				<li key={Math.random()} style={{ listStyleType: "none" }}>
				<input 
					type="checkbox"
					readOnly
					checked={task.checked}
					onClick={() => this.toggleChecked(task)}
				/>
				<span className="text">{"for " + task.disaster +" "+ task.text}</span>
				</li>
			)
		)
	}
		
			</div>)
	}
}

export default withTracker(() => {
	return{
		tasks: Tasks.find().fetch(),
		count: Tasks.find().count(),
		checked: Tasks.find({checked: true}).count()
	}
})(List)
