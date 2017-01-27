import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Login from './login'
import Register from './register'

let ErrorMessage = ({error, success}) => (
    <div className="row">
        { error.length == 0 ? '' :
            <div className="alert alert-danger">
                <div className="col-sm-1"></div>
                <div className="col-sm-10" id="errorMessage">{ error }</div>
                <div className="col-sm-1"></div>
                <div className="row">&nbsp;</div>
            </div>
        }
        { success.length == 0 ? '' :
            <div className="alert alert-success">
                <div className="col-sm-1"></div>
                <div className="col-sm-10" id="successMessage">{ success }</div>
                <div className="col-sm-1"></div>
                <div className="row">&nbsp;</div>
            </div>
        }
    </div>
)
ErrorMessage.propTypes = {
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired
}
ErrorMessage = connect((state) => {
    return { error: state.common.error, success: state.common.success }
})(ErrorMessage)

const Landing = () => (
    <div className="container-fluid">
        <div className="jumbotron">
            
                <div className="row row-header">
                    <div className="text-center">
                        <h1><strong>Welcome to Ricebook!</strong></h1>
                    </div>
                    <img src="http://www.rice.edu/_images/rice-logo.jpg" alt="Image Missing" id="rice_img"/>
                </div>
            
        </div>

        <ErrorMessage/>

        <div className="container">
            <div className="row">

                <div className="col-xs-8 col-md-8">
                            <Register/>
                </div>

                <div className="col-xs-4 col-md-4">
                                <Login/>
                </div>

            </div>
        </div>

    </div>
)

export default Landing



/** WEBPACK FOOTER **
 ** ./src/components/auth/landing.js
 **/