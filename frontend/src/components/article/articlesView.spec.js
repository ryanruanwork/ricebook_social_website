
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import TestUtils from 'react-addons-test-utils'
import {findDOMNode} from 'react-dom'
import {expect} from 'chai'
import {shallow} from 'enzyme'
import {ArticlesView} from './articlesView'
import {NewArticle} from './newArticle'
import Reducer from '../../reducers'

const state = {
    common:{error:'', success: '',location: ''},
    articles:{articles:{},searchKeyword:'', avatars: {} },
    profile: { username: '',headline: '',avatar: '',email: '',zipcode: '',dob: ''},
    followers:{ followers: {}}
}

describe('ArticlesView (component tests)', ()=>{

    it('should render articles', ()=>{

        const articles = [{_id: 1, author: 'Ryan', date: '10/24/2016', comments: [], avatar:[], text:[], img:[]}]

        const node = shallow(
            <div>
                <ArticlesView username='jr58' articles={articles} dispatch={_=>_}/>
            </div>
        )
        expect(node.children().length).to.equal(1)

    })

    let articles = {1:{id:1,author:'jr58', text:'text1'}}  
    let addAricle = {id:2,author:'jr58', text:'text3'}
    let newArticles = {...articles, 2: addAricle}

    it('should dispatch actions to create a new article',()=> {
        expect(Reducer(Reducer(undefined, {type:'UPDATE_ARTICLES', articles}), {type:'ADD_ARTICLE', article: addAricle }))
       .to.eql({...state, articles: {...state.articles, articles:newArticles }})
    })

})