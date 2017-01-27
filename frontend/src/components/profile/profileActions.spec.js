import { expect } from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'
import Action, { apiUrl } from '../../actions'

let profileActions

describe('Validate Profile actions (mocked requests)', () => {


  beforeEach(() => {
      if (mockery.enable) {
      mockery.enable({warnOnUnregistered: false, useCleanCache:true})
      mockery.registerMock('node-fetch', fetch)
      require('node-fetch')
      }
      profileActions = require('./profileActions')
  })

  afterEach(() => {
      if (mockery.enable) {
      mockery.deregisterMock('node-fetch')
      mockery.disable()
      }
  })

  it('should update the status message', (done) => {

      const username = 'sep1test'
      const headline = 'A new headline!'

      mock(`${apiUrl}/headline`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        json: { username, headline }
      })

      profileActions.updateHeadline('does not matter')(
        fn => fn(action => {
        expect(action).to.eql({ 
          headline, type:'UPDATE_PROFILE'
        })
        done()
      }))

  })

  it('should fetch the user profile information', (done) => {
  
      const avatar = 'avatar'
      const zipcode = '77005'
      const email = 'jr58@rice.edu'


      mock(`${apiUrl}/avatars`, {
        method: 'GET',
        headers: {'Content-Type':'application/json'},
        json: { avatars : [{avatar}] }
      })

      mock(`${apiUrl}/zipcode`, {
        method: 'GET',
        headers: {'Content-Type':'application/json'},
        json: { zipcode }
      })  
      
      mock(`${apiUrl}/email`, {
        method: 'GET',
        headers: {'Content-Type':'application/json'},
        json: { email }
      })

      
      var tmp = 0;
      profileActions.fetchProfile()(
        fn => fn(action => {
         

                if (tmp == 0){
                    expect(action).to.eql({
                        avatar:avatar, type:'UPDATE_PROFILE'
                    })
                    tmp++                 
                }
                else if (tmp == 1){

                    expect(action).to.eql({
                        zipcode, type:'UPDATE_PROFILE'
                    })
                    tmp++
                }
                else if (tmp == 2){

                    expect(action).to.eql({
                        email, type:'UPDATE_PROFILE'
                    })
                    tmp++
                    done()
                }
                
      }))

  })

})
