import { expect } from 'chai'
import { go, sleep, findId, findCSS, By } from './selenium'
import profileInfo from './profileInfo'

describe('End-to-End Test: Update Profile', () => {
	
	it('-should update the email and verify', (done) => {
		sleep(500)
		.then(profileInfo.updateEmail)
		.then(sleep(500))
        .then(findId('email').getAttribute('placeholder')
        	.then(text => {
                expect(text).to.equal(`${profileInfo.profile.email}`)
            })
            .then(done))
    })

    it('-should update the user zipcode and verify', (done) => {
		sleep(500)
		.then(profileInfo.updateZipcode)
		.then(sleep(500))
        .then(findId('zipcode').getAttribute('placeholder')
        	.then(text => {
                expect(text).to.equal(`${profileInfo.profile.zipcode}`)
            })
            .then(done))
    })

    it('-should update the user password, verify a "will not change" message is returned', (done) => {
		sleep(500)
		.then(profileInfo.updatePassword)
		.then(sleep(500))
        .then(findId('errorMessage').getText()
        	.then(text => {
                expect(text).to.equal(`successfully update the password, but will not persist`)
            })
            .then(done))
    })
})