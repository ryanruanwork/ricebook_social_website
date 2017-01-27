import React from 'react'

import Headline from './headline'
import Following from './following'
import ArticlesView from '../article/articlesView'

const Main = () => (
    // This is the main view.
    // On this view we display the user's avatar, their headline,
    // their feed of articles (with a search fiilter),
    // and their list of followers.
    <div className="row">
        <div className="row">&nbsp;</div>
        <div className="row">&nbsp;</div>
        <div className="row">&nbsp;</div>

        <div className="col-md-3 col-xs-3" id="contain-setting">
            <Headline/>
            <Following/>
        </div>
        <div className="col-md-9 col-xs-9">
        <ArticlesView/>
        </div>
    </div>
)

export default Main



/** WEBPACK FOOTER **
 ** ./src/components/main/main.js
 **/