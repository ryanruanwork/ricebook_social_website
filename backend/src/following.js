'use strict';
//this is the stub for following
const Profile = require('./model.js').Profile

const getFollowing = (req, res) => {
	const username = req.params.user ? req.params.user : req.username
	Profile.find({username: username}).exec(function(err, profile){
		if(!profile || profile.length === 0){
			res.status(400).send("this user doesn't exist in the db")
            return
		}
		const profileObj = profile[0]
		res.status(200).send({username: username, following: profileObj.following})
	})
}

const putFollowing = (req, res) => {
	const user = req.params.user
	const username = req.username
	if (!user) {
		res.status(400).send('you did not supply the user to follow')
	}
	Profile.find({username: user}).exec(function(err, profile){
		if(!profile || profile.length === 0) {
			res.status(400).send('you can not follow those who are not in db')
		} else {
			Profile.findOneAndUpdate({username: username}, { $addToSet: { following: user }}, {new: true}, function(err, profile){})
			Profile.find({username: username}).exec(function(err, profile){
				const profileObj = profile[0]
				res.status(200).send({username: username, following: profileObj.following})
			})
		}
	})
}

const deleteFollowing = (req, res) => {
	const user = req.params.user
	const username = req.username
	if (!user) {
		res.status(400).send('you did not supply the user to follow')
	}
	Profile.findOneAndUpdate({username: username}, { $pull: { following: user }}, {new: true }, function(err, profile){})
	Profile.find({username: username}).exec(function(err, profile){
		const profileObj = profile[0]
		res.status(200).send({username: username, following: profileObj.following})
	})
}

module.exports = app => {
    app.get('/following/:user?', getFollowing)
    app.put('/following/:user', putFollowing)
    app.delete('/following/:user', deleteFollowing)
}