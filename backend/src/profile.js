'use strict';

// this is profile.js which contains all user profile 
// information except passwords which is in auth.js
const parseFD = require('./uploadCloudinary')
const Profile = require('./model.js').Profile

const getHeadlines = (req, res) => {
	const users = req.params.users ? req.params.users.split(',') : [req.username]
	Profile.find({username: {$in: users}}).exec(function(err, profiles){
		let headlines = []
		if (!profiles || profiles.length === 0){
            res.status(500).send("none of these users exist in the db or you didn't supply at all")
            return
        }
        profiles.forEach(item => {headlines.push({username: item.username, headline: item.headline})})
        res.status(200).send({headlines:headlines})
    })
}

const putHeadline = (req, res) => {
	const user = req.username
	const headline = req.body.headline
	if (!headline) {
		res.status(400).send('you did not supply headline')
	}
	Profile.update({username: user}, { $set: { headline: headline }}, { new: true }, function(err, profile){
        res.status(200).send({username: user, headline: headline});
    }) 
}

const getEmail = (req, res) => {
	const username = req.params.user ? req.params.user : req.username
	Profile.find({username: username}).exec(function(err, profile){
		if(!profile || profile.length === 0){
			res.status(500).send("this user doesn't exist in the db")
            return
		}
		const profileObj = profile[0]
		res.status(200).send({username: username, email: profile[0].email})
	})
}

const putEmail = (req,res) => {
	const username = req.username
	const email = req.body.email
	if (!email) {
		res.status(400).send('you did not supply email')
	}
	Profile.update({username: username}, { $set: { email: email }}, { new: true }, function(err, profile){
        res.status(200).send({username: username, email: email});
    })
}

const getZipcode = (req, res) => {
	const username = req.params.user ? req.params.user : req.username
	Profile.find({username: username}).exec(function(err, profile){
		if(!profile || profile.length === 0){
			res.status(500).send("this user doesn't exist in the db")
            return
		}
		const profileObj = profile[0]
		res.status(200).send({username: username, zipcode: profile[0].zipcode})
	})
}

const putZipcode = (req,res) => {
	const username = req.username
	const zipcode = req.body.zipcode
	if (!zipcode) {
		res.status(400).send('you did not supply zipcode')
	}
	Profile.update({username: username}, { $set: { zipcode: zipcode }}, { new: true }, function(err, profile){
        res.status(200).send({username: username, zipcode: zipcode});
    })
}

const getAvatars = (req, res) => {
	const users = req.params.users ? req.params.users.split(',') : [req.username]
	Profile.find({username: {$in: users}}).exec(function(err, profiles){
		let avatars = []
		if (!profiles || profiles.length === 0){
            res.status(400).send("none of these users exist in the db or you didn't supply at all")
            return
        }
        profiles.forEach(item => {avatars.push({username: item.username, avatar: item.avatar})})
        res.status(200).send({avatars:avatars})
    })
}

const putAvatar = (req,res) => {
	const username = req.username
	const avatar = req.fileurl
	if (!avatar) {
		res.status(400).send('you did not supply avatar')
	}
	Profile.update({username: username}, { $set: { avatar: avatar }}, { new: true }, function(err, profile){
        res.status(200).send({username: username, avatar: avatar});
    })
	
}

const getDob = (req, res) => {

	const username = req.username;

	Profile.find({username: username}).exec(function(err, profile){
		const profileObj = profile[0]
		res.status(200).send({username: username, dob: profile[0].dob})
	})
}

module.exports = app => {
     app.get('/headlines/:users?', getHeadlines)
     app.put('/headline', putHeadline)

     app.get('/email/:user?', getEmail)
     app.put('/email', putEmail)

     app.get('/zipcode/:user?', getZipcode)
     app.put('/zipcode', putZipcode)

     app.get('/avatars/:users?', getAvatars)
     app.put('/avatar', parseFD('avatar'), putAvatar)

     app.get('/dob', getDob)
}
