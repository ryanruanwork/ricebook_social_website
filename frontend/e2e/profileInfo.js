import { expect } from 'chai'
import { findId, sleep } from './selenium'

// TODO add your test user credentials here!
exports.profile = {
    email: 'jr2@rice.edu',
    zipcode: '11111',
    password: '12345',
    pwconf: '12345'
}

exports.updateEmail = () => 
    sleep(300)
    .then(findId('email').clear())
    .then(findId('email').sendKeys(exports.profile.email))
    .then(findId('update').click())

exports.updateZipcode = () => 
    sleep(300)
    .then(findId('zipcode').clear())
    .then(findId('zipcode').sendKeys(exports.profile.zipcode))
    .then(findId('update').click())

exports.updatePassword = () => 
    sleep(300)
    .then(findId('password').clear())
    .then(findId('pwconf').clear())
    .then(findId('password').sendKeys(exports.profile.password))
    .then(findId('pwconf').sendKeys(exports.profile.pwconf))
    .then(findId('update').click())