import { expect } from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'
import Action, { apiUrl } from '../../actions'

let articleActions
describe('Validate Article actions', () => {

    beforeEach(() => {
        if (mockery.enable) {
            mockery.enable({warnOnUnregistered: false, useCleanCache:true})
            mockery.registerMock('node-fetch', fetch)
            require('node-fetch')
        }
        articleActions = require('./articleActions')
    })

    afterEach(() => {
        if (mockery.enable) {
            mockery.deregisterMock('node-fetch')
            mockery.disable()
        } 
    })  


    it('should fetch articles (mocked request)', (done)=>{
        const State = {articles : {avatars:{}}}

        mock(`${apiUrl}/articles`,{
            method:'GET',
            headers: {'Content-Type':'application/json'},
            json: { articles: [{_id: 1, author: 'jr58', comments: [] }]}
        })

        articleActions.fetchArticles()(
            action =>{
                expect(action).to.satisfy((action)=>{
                    return action.type=='UPDATE_ARTICLES' && action.articles['1'].author == 'jr58'
                })
                done()
            }
            ,
            ()=>{return State}
        )

    })

    it('should update the search keyword', ()=>{
        const keyword = 'keyword'
        expect(articleActions.searchKeyword(keyword)).to.eql({type:'SEARCH_KEYWORD',keyword})
        
    })



})
