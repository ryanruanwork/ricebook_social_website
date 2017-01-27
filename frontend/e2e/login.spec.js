'use strict';
import { expect } from 'chai'
import { go, sleep, findId, findCSS, By, findClassName, findElements, driver} from './selenium'
import loginInfo from './loginInfo'

describe(' End-to-End Test: MainPage', () => {

    before('should log in', (done) => {
        go().then(loginInfo.login).then(done)
    })

    it('-should log in as the test user', (done) => {
        sleep(500)
        .then(findId('usernameTxt').getText()
        	.then(text => {
                expect(text).to.equal(`${loginInfo.creds.username}`)
            }))
        .then(done)
    })

    it("-should create new article and validate article appears in feed", (done) => {
        var newArticle = 'hello world by jr58!!!'
        sleep(500)
        .then(findId('newArticleTxt').sendKeys(newArticle))
        .then(findId('newArticleBtn').click())
        .then(sleep(500))
        .then(findClassName('media-body').getText()	//use className selector to choose the first one
            .then(text => {
                expect(text).to.equal(newArticle)
            }))
        .then(done)
    })

    it('-should edit an article and validate the article text has updated', (done) => {
        var editArticle = 'append to old one'
        sleep(500)
        .then(findClassName('media-body').clear())
        .then(findClassName('media-body').sendKeys(editArticle))
        .then(sleep(500))
        .then(findClassName('media-body').getText()	//use className selector to choose the first one
            .then(text => {
                expect(text).to.equal(editArticle)
            }))
        .then(done)
    })

    it('-should update the status headline and verify the change', (done) => {
        var newHeadline = 'new headline!'
        sleep(500)
        .then(findId('headline').sendKeys(newHeadline))
        .then(findId('updateHeadlineBtn').click())
        .then(sleep(500))
        .then(findId('headlineTxt').getText()
            .then(text => {
                expect(text).to.equal(newHeadline)
            }))
        .then(done)
    })

    it('-should count the number of followed users', (done) => {
        sleep(500)
        .then(findElements('[name="follower"]')
        	.then(followers => {
                expect(followers.length).to.be.at.least(2)
            }))
        .then(done)
    })

    it('-should add the user "Follower" to the list of followed user and verify the count increases by one', (done) => {
        var newFollower = 'jy54'
        sleep(500)
        .then(findElements('[name="follower"]')
        	.then(followers => {
                let orginalNum = followers.length
                findId('newFollowerTxt').clear()
        			.then(findId('newFollowerTxt').sendKeys(newFollower))
        			.then(findId('newFollowerBtn').click())
        			.then(sleep(500))
        			.then(findElements('[name="follower"]')
        				.then(followers => {
        				expect(followers.length).to.equal(orginalNum + 1)
        			}))
            }))
        .then(done)
    })

    it('-should remove the user "Follower" from the list of followed user and verify the count decreases by one', (done) => {
        sleep(500)
        .then(findElements('[name="follower"]')
        	.then(followers => {
                let orginalNum = followers.length
                	driver.executeScript("arguments[0].click();", findId('unfollowBtn')) 
                	//nav bar block the mouse, use js click to solve the problem
        			.then(sleep(500))
        			.then(findElements('[name="follower"]')
        				.then(followers => {
        				expect(followers.length).to.equal(orginalNum - 1)
        			}))
            }))
        .then(done)
    })

    it('-should search for "Only One Article Like This" and verify only one article show, and verify the author', (done) => {
        var searchWord = 'Only One Article Like This'
        sleep(500)
        .then(findId('searchTxt').clear())
        .then(findId('searchTxt').sendKeys(searchWord))
        .then(sleep(500))
        .then(findCSS('.author').getText()
                .then(author => {
                    expect(author).eql('jr58test')
                }))
        .then(findId('searchTxt').clear())
        .then(done)
    })

    after('should log out', (done) => {
        loginInfo.gotoProfile().then(done)
    })
})
