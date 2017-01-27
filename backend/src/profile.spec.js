'use strict'
/*
 * Test suite for profile.js
 */
const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = (path) => `http://127.0.0.1:3000${path}`


describe('Validate Profile functionality', () => {
	
	it('should update headline after use PUT', (done) => {
		var oldheadline;
        var newheadline = "updated new headline"
        var username;
        fetch(url("/headlines"), {
            "method" : 'GET',
            "headers": {'Content-Type' : 'application/json' }
        })
        .then(res => {
            expect(res.status).to.eql(200)  
            return res.json()
        })
        .then(res => {
            oldheadline = res.headlines[0].headline
            username = res.headlines[0].username
        })

        .then(_=>{

            return fetch(url("/headline"), {
                "headers": {'Content-Type': 'application/json'},
                "method": 'PUT',
                "body": JSON.stringify({"headline": newheadline})
            })            
        })
        .then(res=>{
            expect(res.status).to.equal(200)
            return res.json()
        })
        .then((res)=>{
            expect(res.headline).to.equal(newheadline)
        })

        .then(_=>{
            return fetch(url("/headlines/" + username), {
                "method": 'GET',
                "headers": {'Content-Type': 'application/json'}
            })
        })
        .then(res => {
            expect(res.status).to.equal(200)
            return res.json()
        })
        .then(res => {
            expect(res.headlines[0].headline).to.equal(newheadline)
            expect(res.headlines[0].headline).to.not.equal(oldheadline)
        })

        .then(done)
        .catch(done)
    
    }, 200)


})