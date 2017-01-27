import { expect } from 'chai'
import { findId, sleep } from './selenium'

exports.reginfo = {
    username: 'ryan',
    display_name: 'Ryan',
    email: 'jr58@rice.edu',
    phone: '281-236-7254',
    birth: '01-01-1990',
    zipcode: '77030',
    password: '1',
    pwconf: '1'
}
exports.register = () => 
    sleep(500)
    .then(findId('username').clear())
    .then(findId('display_name').clear())
    .then(findId('email').clear())
    .then(findId('phone').clear())
    .then(findId('birth').clear())
    .then(findId('zipcode').clear())
    .then(findId('password').clear())
    .then(findId('pwconf').clear())
    .then(findId('username').sendKeys(exports.reginfo.username))
    .then(findId('display_name').sendKeys(exports.reginfo.display_name))
    .then(findId('email').sendKeys(exports.reginfo.email))
    .then(findId('phone').sendKeys(exports.reginfo.phone))
    .then(findId('birth').sendKeys(exports.reginfo.birth))
    .then(findId('zipcode').sendKeys(exports.reginfo.zipcode))
    .then(findId('password').sendKeys(exports.reginfo.password))
    .then(findId('pwconf').sendKeys(exports.reginfo.pwconf))
    .then(findId('submitButton').click())
    .then(sleep(2000))

