/*
 * Test suite for articles.js
 */
const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Validate Article functionality', () => {

	it('should give me three or more articles', (done) => {
		fetch(url("/articles"))
        .then((res)=>{
            expect(res.status).to.eql(200)
            return res.json()
        })
        .then(body=>{
            expect(body.articles.length).to.be.at.least(3)
            len = body.articles.length
        })
        .then(done)
        .catch(err=>{
            throw new Error(err)
        })
 	}, 200)

    it('should return an article with a specified id', (done) => {
        fetch(url('/articles'))
        .then(res=>{
            return Object.keys(res.json())[0]
        })
        .then((key)=>{
            fetch(url(`/articles/${key}`))
            .then(res=>{
                expect(Object.keys(res)).to.have.length(1)
            })
        })
        .then(done)
        .catch(err=>{
           throw new Error(err)
        })
    }, 200)

    it('should return nothing for an invalid id', (done) => {
        // call GET /articles/id where id is not a valid article id, perhaps 0
        // confirm that you get no results
        fetch(url("/articles/-1"))
            .then(res => {
                expect(res.status).to.eql(200)  
                return res.text()
            })
            .then(body => {
                expect(JSON.parse(body)).to.eql([])
            })
            .then(done)
            .catch(done)

    }, 200)

	it('should add an article and test the new id and text', (done) => {

		const article1 = {text: 'newTxt', author:'newAuthor'}

        fetch(url('/article'),{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(article1)
        })
        .then((res)=>{
            expect(res.status).to.eql(200)
            return res.json()
        })
        .then((body)=>{
            expect(body.text).to.eql(article1.text)
            expect(body.author).to.eql(article1.author)
        })
        fetch(url("/articles"))
        .then(res => {
            expect(res.status).to.eql(200)
            return res.json()
        })
        .then(body => {
            expect(body.articles.length).to.eql(len + 1)
        })
        .then(done)
        .catch(done)
 	}, 200)

});