import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { register } from './authActions'

class Register extends Component {

    componentDidUpdate() {
        if (this.props.error.length == 0) {
            this.email.value = null
            this.phone.value = null
            this.birth.value = null
            this.zipcode.value = null
            this.password.value = null
            this.pwconf.value = null
        }
    }

    render() { return (
        
            <form onSubmit={(e) => {
                e.preventDefault()
                const payload = {
                    username:this.username.value,
                    display_name:this.display_name.value,
                    email:this.email.value,
                    phone:this.phone.value,
                    birth:this.birth.value,
                    zipcode:this.zipcode.value,
                    password:this.password.value,
                    pwconf:this.pwconf.value
                }
                this.props.dispatch(register(payload))
            }}>
                <fieldset className="form-group">
                <legend>Register</legend>
                <div className="form-group row">
                    <label className="col-md-2 col-form-label" for="username">Account Name</label>
                    <div className="col-md-3">
                        <input type="text" id="username" className="form-control" placeholder="your name" 
                        pattern="[A-Za-z]+[A-Za-z0-9]*" ref={(node) => this.username = node }
                        title="Account name can only be upper or lower case letters and numbers, but may not start with a number" required/>
                    </div>
                    <label className="col-md-2 col-form-label" for="display_name">Display Name(optional)</label>
                    <div className="col-md-3">
                        <input type="text" id="display_name" className="form-control" ref={(node) => this.display_name = node } placeholder="your display name(optional)" />
                    </div>
                </div>
                <div className="form-group row">
                    <label  className="col-md-2 col-form-label" for="email">Email Address</label>
                    <div className="col-md-3">
                        <input type="text" id="email" className="form-control" placeholder="a@b.co" 
                        pattern="[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+" ref={(node) => this.email = node }
                        title="Not a valid Email" required/>
                    </div>
                    <label className="col-md-2 col-form-label" for="phone">Phone Number</label>
                    <div className="col-md-3">
                        <input type="text" id="phone" className="form-control" placeholder="123-123-1232" 
                        pattern="\d{3}-\d{3}-\d{4}" ref={(node) => this.phone = node }
                        title="Phone number should be the format of 123-123-1234" required/>
                    </div>
                </div>
                <div className="form-group row">
                    <label className="col-md-2 col-form-label" for="birth">Date of Birth</label>
                  <div className="col-md-3">
                        <input type="text" id="birth" className="form-control" placeholder="01-01-1990" 
                        pattern="\d\d-\d\d-\d\d\d\d" ref={(node) => this.birth = node }
                        title="birth should be the format of 01-01-1990" required/>
                  </div>
                  <label className="col-md-2 col-form-label" for="zipcode">Zip Code</label>
                  <div className="col-md-3">
                        <input type="text" id="zipcode" className="form-control" placeholder="XXXXX" 
                        pattern="\d{5}" ref={(node) => this.zipcode = node }
                        title="US zipcode should be exactly 5 digits." required/>
                  </div>
                </div>
                <div className="form-group row">
                    <label className="col-md-2 col-form-label" for="password">Password</label>
                    <div className="col-md-3">
                        <input type="password" id="password" ref={(node) => this.password = node }
                        className="form-control" required/>
                    </div>
                    <label className="col-md-2 col-form-label" for="pwconf">Password Confirmation</label>
                    <div className="col-md-3">
                        <input type="password" id="pwconf" ref={(node) => this.pwconf = node }
                        className="form-control" required/>
                    </div>
                </div>
                <div className="form-group row" id="reg_frm_btn">
                    <input type="submit" id="submitButton" className="col-md-6"
                    className="btn btn-success" value="Register"/>
                    <input type="reset" id="Clear" className="col-md-6"
                    className="btn btn-info" value="Clear"/>
                </div>
                </fieldset>
            </form>
        
    )}
}

export default connect()(Register)



/** WEBPACK FOOTER **
 ** ./src/components/auth/register.js
 **/