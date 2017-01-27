import {expect} from 'chai'

import Action from './actions'
import Reducer, {common, articles} from './reducers'
import {filterFunction} from './components/article/articlesView'


describe('Validate reducer (no fetch requests here)', ()=> {
	it('should initialize state', ()=>{
		expect(Reducer(undefined,{})).to.eql({
			articles:{articles:{},searchKeyword:'',avatars: {}},
			profile:{ username:'', headline:'', avatar:'', zipcode:'', email:'',dob:''},
			followers:{followers:{}},
			common:{error:'', success:'', location:''},
		})
	})

	it('should state success (for displaying success message to user)',()=> {
		expect(common(undefined,{type:Action.SUCCESS, success:'success message'}))
		.to.eql({error:'', location:'',success:'success message'})
	})

	it('should state error (for displaying error message to user)',()=> {
		expect(common(undefined,{type:Action.ERROR, error:'error message'}))
		.to.eql({error:'error message', location:'', success:''})
	})

	it('should set the articles',()=> {
		expect(articles(undefined,{type:Action.UPDATE_ARTICLES, articles:{
			1:{_id:1, text:'Becoming a web developer', author:'jr58',date:'10/24/2016'}
		}}))
		.to.eql({searchKeyword:'', articles:{1:{_id:1, text:'Becoming a web developer', author:'jr58',date:'10/24/2016'}}, avatars: {}})
	})

	it('should set the search keyword',()=> {
		expect(articles(undefined,{type:Action.SEARCH_KEYWORD, keyword:'search keyword'}))
		.to.eql({articles:{}, searchKeyword:'search keyword', avatars: {}})
	})

	it('should filter displayed articles by the search keyword',()=> {
		const articles = {1:{_id:1, text:'hello world!', author:'jr58', date:'10/24/2016'},
						  2:{_id:2, text:'hello javascript', author:'jr58', date:'10/24/2016'}}
		const keyword = 'world'
		expect(filterFunction(articles,keyword)).to.eql([{_id:1, text:'hello world!', author:'jr58', date:'10/24/2016'}]);
	})
})