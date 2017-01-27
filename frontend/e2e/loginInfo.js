import { expect } from 'chai'
import { findId, sleep } from './selenium'

// TODO add your test user credentials here!
exports.creds = {
    username: 'jr58test',
    password: 'heard-rice-take'
}

exports.login = () => 
    sleep(500)
    .then(findId('loginUsername').clear())
    .then(findId('loginPassword').clear())
    .then(findId('loginUsername').sendKeys(exports.creds.username))
    .then(findId('loginPassword').sendKeys(exports.creds.password))
    .then(findId('login').click())
    .then(sleep(2000))

exports.gotoProfile = () =>
    sleep(500)
    .then(findId('profilePageBtn').click())
    