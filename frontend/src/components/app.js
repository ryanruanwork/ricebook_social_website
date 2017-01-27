import React from 'react'
import { connect } from 'react-redux'

import Nav from './main/nav'
import Main from './main/main'
import Landing from './auth/landing'
import Profile from './profile/profile'

const App = ({location}) => {

    // this is my routing solution
    let view
    switch(location) {
        case 'main': view = <Main/>; break;
        case 'profile': view = <Profile/>; break;
        default: view = <Landing/>; break;
    }

    return (
        <div>
            <Nav/>
            { view }
        </div>
    )
}

export default connect((state) => {
    return { location: state.common.location }
})(App)



/** WEBPACK FOOTER **
 ** ./src/components/app.js
 **/