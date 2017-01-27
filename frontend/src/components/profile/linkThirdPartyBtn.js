import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { linkFacebook, linkGoogle } from './profileActions'

class LinkThirdPartyBtn extends Component {

	render() { return (

		<div>
		{ this.props.loginUser.split('@')[1] ? '' :
			
				<div className="form-group row">
		            <div className="col-sm-6">
		            	<button className="btn btn-danger" type="button" id="linkThirdPartyBtn_gg" 
		                	onClick = {() => {this.props.dispatch(linkGoogle())}}>Link Google</button>
		            </div>
		            <div className="col-sm-6">
		                <button className="btn btn-primary" type="button" id="linkThirdPartyBtn_fb" 
		                	onClick = {() => {this.props.dispatch(linkFacebook())}}>Link Facebook</button>
		            </div>
		        </div>	    
	    }
	    </div>
	)}
}

LinkThirdPartyBtn.propTypes = {
		loginUser: PropTypes.string.isRequired
}

export default connect(
	(state) => {
		return {
			loginUser: state.profile.username || ''
		}
	}
)(LinkThirdPartyBtn)
