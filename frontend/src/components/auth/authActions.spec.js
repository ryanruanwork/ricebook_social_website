import { expect } from 'chai'
import mockery from 'mockery'
import fetch, {mock} from 'mock-fetch'
import Action, { apiUrl } from '../../actions'
import { localLogin, logout } from './authActions'

describe('Validate Authentication (involves mocked requests)', () => {

	beforeEach(() => {
		if(mockery.enable) {
			mockery.enable({warnOnUnregistered: false, useCleanCache:true})
			mockery.registerMock('node-fetch', fetch)
			require('node-fetch')
  		}
	})

	afterEach(() => {
  		if (mockery.enable) {
			mockery.deregisterMock('node-fetch')
			mockery.disable()
  		}
	})

	
	it('should log in the user', (done)=>{

        const username = 'jr58'
        const password = 'keep-degree-from'


        mock(`${apiUrl}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            json: {username, result:'success'}
        })

     
        localLogin(username, password)(
            (action)=>{
                                   
                    expect(action).to.eql({
                        type:'LOGIN_LOCAL',
                        username
                   })
         
                    done()
            }
        )
    })


     it('should not log in an invalid user', (done)=>{

        const username = 'wrongusername'
        const password = 'wrongpassword'


        mock(`${apiUrl}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'},
            status: 401,
            statusText: 'Unauthorized'
        })

     

        localLogin(username, password)(
            (action)=>{
                    expect(action).to.eql({
                        type:'ERROR',
                        error : `There was an error logging in as ${username}`
                   })
       
                    done()
            }
        )
    })


    it('should log out a user (state should be cleared)', (done)=>{
        mock(`${apiUrl}/logout`,{
            method: 'PUT',
            headers: {'Content-Type':'application/json'}
        })


        logout()(
            (action)=>{
                expect(action).to.eql({
                    type:'NAV_OUT'
                })
                done()
            }
        )
        
    })


})

