import React from 'react'
import { connect } from 'react-redux'
import { localLogin, fbLogin, ggLogin} from './authActions'

const Login = ({dispatch}) => {
    let username, password
    
    return (

        <div id="form_login">
            
            
            <fieldset className="form-group">
            <legend>Login</legend>
            <div className="form-group row">
                  <label className="col-sm-4 col-form-label" for="username">username</label>
                  <div className="col-sm-8">
                        <input type="text" id="loginUsername" className="form-control" ref={(node) => { username = node }}
                        placeholder="username" required/>
                  </div>
            </div>
            <div className="form-group row">
                  <label className="col-sm-4 col-form-label" for="user_password">Password</label>
                  <div className="col-sm-8">
                        <input type="password" id="loginPassword" className="form-control" ref={(node) => { password = node }}
                        placeholder="password" required/>
                  </div>
            </div>
            <div className="form-group row" id="lgn_frm_btn">
                    <input type="submit" id="login" className="btn btn-success" value="Login"
                    onClick={() => { dispatch(localLogin(username.value, password.value)) }}/>
            </div>
            <div className="form-group row" id="lgn_fb_div">
                    <input type="image" src="https://drmqjozm1bc8u.cloudfront.net/images/responsive/fb_login_button.png" 
                    id="img_lgn_fb" onClick = {() => {dispatch(fbLogin())}}/>
            </div>
            <div className="form-group row" id="lgn_gg_div">
                <input type="image" src="http://www.patterson.k12.ca.us/UserFiles/Servers/Server_18037253/Templates/login-google.png" 
                    id="img_lgn_fb" onClick = {() => {dispatch(ggLogin())}}/>
            </div>
            </fieldset>
            

        </div>
    )
}

export default connect()(Login)



/** WEBPACK FOOTER **
 ** ./src/components/auth/login.js
 **/