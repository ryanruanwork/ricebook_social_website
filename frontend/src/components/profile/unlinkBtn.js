import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { unlinkAccount } from './profileActions'

class UnlinkBtn extends Component {

	render() { return (
		<div>
			{this.props.loginUser.split('@')[1] ? '' :
				<div className="form-group row">
		            <div className="col-sm-6">
		            	<button className="btn btn-warning" type="button" 
		                	onClick = {() => {this.props.dispatch(unlinkAccount('google'))}}>UnLink Google</button>
		            </div>
		            <div className="col-sm-6">
		                <button className="btn btn-warning" type="button"
		                	onClick = {() => {this.props.dispatch(unlinkAccount('facebook'))}}>UnLink Facebook</button>
		            </div>
		        </div>
		    }
	    </div>
	)}
}

UnlinkBtn.propTypes = {
		loginUser: PropTypes.string.isRequired
}

export default connect(
	(state) => {
		return {
			loginUser: state.profile.username || ''
		}
	}
)(UnlinkBtn)
