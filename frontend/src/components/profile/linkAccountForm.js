import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { linkAccountFun } from './profileActions'

class LinkAccountForm extends Component {

	componentDidUpdate() {
        if (this.props.error.length == 0) {
            this.regUsername.value = null
            this.regPassword.value = null
        }
    }

    render() { return (

        <form onSubmit={(e) => {
            if (e) e.preventDefault()
            const payload = {
         		regUsername:this.regUsername.value,
                regPassword:this.regPassword.value
            }
            this.props.dispatch(linkAccountFun(payload))
        }}>
        { !this.props.loginUser.split('@')[1] ? '' :
            <div>
                <div className="form-group row">
                    <label className="col-sm-3 form-control-label" for="regUsername">regualr username</label>
                    <div className="col-sm-6">
                        <input className="form-control" id="regUsername" type="text" placeholder="username for regualr login"
                            ref={(node) => this.regUsername = node }/>
                    </div>
                </div>        
                <div className="form-group row">
                    <label className="col-sm-3 form-control-label" for="regPassword">regular password</label>
                    <div className="col-sm-6">
                        <input className="form-control" id="regPassword" type="password" placeholder="password for regular login"
                            ref={(node) => this.regPassword = node }/>
                    </div>
                </div>
                <div className="form-group row">
                    <span className="col-sm-3 form-control-label"></span>
                    <div className="col-sm-9">
                        <button className="btn btn-primary" type="submit" id="linkAccountBtn">Link Account</button>
                    </div>
                </div>
            </div>
        }
    	</form>
    )}
}

LinkAccountForm.propTypes = {
    error: PropTypes.string.isRequired,
    loginUser: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect(
    (state) => {
        return {
            error: state.common.error,
            loginUser: state.profile.username || ''
        }
    }
)(LinkAccountForm)

export { LinkAccountForm as PureLinkAccountForm }