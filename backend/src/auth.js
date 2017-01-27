'use strict';
//this is the stub for authentication
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const md5 = require('md5')
const cookieKey = 'sid'
const User = require('./model.js').User
const Profile = require('./model.js').Profile
const Article = require('./model.js').Article
const Comment = require('./model.js').Comment
const request = require('request')
const session = require('express-session')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = 'I like to be a web developer!'
const redis = require('redis').createClient('redis://h:p5q9eb8pukmt4khb1lv23joh52@ec2-54-204-17-168.compute-1.amazonaws.com:10829')

let originHostUrl = '';

const configFacebookAuth = {
	clientID:'1205657472813475', 
	clientSecret:'3b4e1c0b74ea4ff17144aa15f09df86b', 
	callbackURL:  'http://shrouded-citadel-55552.herokuapp.com/auth/facebook/callback',
	passReqToCallback: true
}

const configGoogleAuth = {
	clientID:'454792006400-tt4ba10qkc7vk6ibmengfuclr97q9bpo.apps.googleusercontent.com', 
	clientSecret:'kkKpFKH59YC2CxjQWyBKAr6C', 
	callbackURL: 'http://shrouded-citadel-55552.herokuapp.com/auth/google/callback',
	passReqToCallback: true
}

const register = (req, res) => {
	const username = req.body.username;
	const email = req.body.email;
	const dob = new Date(req.body.birth).getTime();
	const zipcode = req.body.zipcode;
	const password = req.body.password;
	if (!username || !email || !dob || !zipcode || !password) {
		res.status(400).send({result: "all fields should be supplied"})
		return
	}
	//check if the username has already been used
	User.find({username: username}).exec(function(err, users){
		if(users.length !== 0) {
			res.status(400).send(`${username} has already been registered.`)
			return
		} else {
			const salt = md5(username + new Date().getTime())
			const hash = md5(password + salt)
			const userObj = new User({username: username, salt: salt, hash: hash, auth:[]})
			new User(userObj).save(function (err, usr){
				if(err) return console.log(err)
			})
			const profileObj = new Profile({username: username, headline: "", following:[], email: email, zipcode: zipcode, dob: dob, avatar: "http://staff.rice.edu/images/styleguide/Rice_OwlBlueTMCMYK300DPI.jpg"})
			new Profile(profileObj).save(function (err, usr){
				if(err) return console.log(err)
			})
			//successfully register
			res.send({
				username: username,
				result: 'success'
			})
		}
	})
	
}

const login = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if (!username || !password) {
		res.status(400).send("username or password is missing")
		return
	}

	User.find({username: username}).exec(function(err, users){
        if (!users || users.length === 0){
            res.sendStatus(400)
            return
        }
        const userObj = users[0]
		if(!userObj){
			res.status(400).send("Don't have this user in db")
		}
		const salt = userObj.salt;
		const hash = userObj.hash;

		if(md5(password + salt) === hash){
			const sessionKey = md5(secret + new Date().getTime() + userObj.username)
			redis.hmset(sessionKey, userObj)
			res.cookie(cookieKey, sessionKey, {maxAge: 3600*1000, httpOnly: true})
			res.send({ username: username, result: 'success'})
		} else{
			res.status(401).send("incorrect password!")
		}
	})
}
//use merge to link all
const merge = (req, res) => {
	const username = req.body.regUsername;
	const password = req.body.regPassword;
	if (!username || !password) {
		res.status(400).send("username or password is missing")
		return
	}
	User.find({username: username}).exec(function(err, users){
        if (!users || users.length === 0){
            res.sendStatus(400)
            return
        }
        const userObj = users[0]
		if(!userObj){
			res.status(400).send("Don't have this user in db")
		}
		const salt = userObj.salt;
		const hash = userObj.hash;

		if(md5(password + salt) === hash){
			//third party username
			Article.update({author:req.username}, { $set: { 'author': username}}, { new: true, multi: true}, function(){})
			Article.update({'comments.author' : req.username}, { $set: {'comments.$.author': username}}, { new: true, multi: true }, function(){})
			Comment.update({author:req.username}, { $set: { 'author': username}}, { new: true, multi: true }, function(){})
			Profile.findOne({username: req.username}).exec(function(err, profile){
				if(profile){
					const oldFollowingArr = profile.following
					Profile.findOne({username: username}).exec(function(err, newProfile) {
						if(newProfile){
							//concat
							const newFollowingArr = newProfile.following.concat(oldFollowingArr)
							Profile.update({username: username}, {$set: {'following': newFollowingArr}}, function(){})
						}
					})
					//delete the profile record
					Profile.update({username: req.username}, {$set: {'following':[]}}, function(){})
				}
			})
			User.findOne({username: username}).exec(function(err, user){
				if(user){
					const usrArr = req.username.split('@');
					const authObj = {}
					authObj[`${usrArr[1]}`] = usrArr[0]
					User.update({username: username}, {$addToSet: {'auth': authObj}}, {new: true}, function(){})
				}
			})
			res.status(200).send({ username: username, result: 'success'})
		} else{
			res.status(401).send("incorrect password!")
		}
	})
}

const unlink = (req, res) => {
	const username = req.username
	const company = req.body.company
	User.findOne({username: username}).exec(function(err, user){
		if(user.auth.length !== 0){
			User.findOne({username: username}).exec(function(err,user){
				let authArr = user.auth
				authArr = authArr.filter(function (obj) {
					return Object.keys(obj)[0] !== company;
				})
				User.update({username: username}, {$set: {'auth': authArr}}, {new: true}, function(){})
				res.status(200).send({result: 'successfully unlink ' + company})
			})
		} else {
			res.status(400).send("no link account")
		}
	})
}

//wait for the final requirement
const newPassword = (req, res) => {
	const newPassword = req.body.password;
	const username = req.username;
	if (!newPassword) {
		res.status(400).send("newPassword is missing")
		return
	}
	User.find({username: username}).exec(function(err, users){
        const userObj = users[0]
		const oldSalt = userObj.salt;
		const oldHash = userObj.hash;
		if(md5(newPassword + oldSalt) === oldHash){
			res.status(400).send({username: username, status: 'you have used the same password'})
		}
		else{
			const newSalt = md5(username + new Date().getTime())
			const newHash = md5(newPassword + newSalt)
			User.update({username: username}, { $set: { salt: newSalt, hash: newHash }}, { new: true }, function(err, profile){
		        if(err) return console.log(err)
		        res.status(200).send({username: username, status: 'successfully change the password and you can logout to check'})
		    })
		} 
	})
}
//use Facebook Strategy to login

passport.use(new FacebookStrategy(configFacebookAuth,
	function(req, token, refreshToken, profile, done){
		const username = profile.displayName + "@" + profile.provider
		//check if there is a login user
		const sid = req.cookies[cookieKey]
		if(!sid){
			User.findOne({username: username}).exec(function(err, user) {
				if(!user || user.length === 0){
					const userObj = new User({username: username, authId: profile.id})
					new User(userObj).save(function (err, usr){
						if(err) return console.log(err)
					})
					const profileObj = new Profile({username: username, headline: "login by facebook", following:[], email: null, zipcode: null, dob: new Date(1999,09,09).getTime(), avatar: "http://iconbug.com/data/8a/256/c72e39da5e258b482275a0319d00f7b7.png"})
					new Profile(profileObj).save(function (err, usr){
						if(err) return console.log(err)
					})
				}
				return done(null, profile)
			})
		} else {
			//if there is a local login, link them
			redis.hgetall(sid, function(err, userObj) {
				const localUser = userObj.username
				Article.update({author:username}, { $set: { 'author': localUser}}, { new: true, multi: true }, function(){})
				Article.update({'comments.author' : username}, { $set: {'comments.$.author': localUser}}, { new: true, multi: true }, function(){})
				Comment.update({author:username}, { $set: { 'author': localUser}}, { new: true, multi: true }, function(){})
				Profile.findOne({username: username}).exec(function(err, profileData){
					if(profileData){
						const oldFollowingArr = profileData.following
						Profile.findOne({username: localUser}).exec(function(err, newProfile) {
							if(newProfile){
								//concat
								const newFollowingArr = newProfile.following.concat(oldFollowingArr)
								Profile.update({username: localUser}, {$set: {'following': newFollowingArr}}, function(){})
							}
						})
						//delete the profile record
						Profile.update({username: username}, {$set: {'following':[]}}, function(){})
					}
				})
				User.findOne({username: localUser}).exec(function(err, user){
					if(user){
						let authObj = {}
						authObj[`${profile.provider}`] = profile.displayName
						User.update({username: localUser}, {$addToSet: {'auth': authObj}}, {new: true}, function(){})
					}
				})
			})
			return done(null, profile)
		}
	}
))

//use Google Strategy to login

passport.use(new GoogleStrategy(configGoogleAuth,
	function(req, token, refreshToken, profile, done){
		const username = profile.displayName + "@" + profile.provider
		//check if there is a login user
		const sid = req.cookies[cookieKey]
		if(!sid){
			User.findOne({username: username}).exec(function(err, user) {
				if(!user || user.length === 0){
					const userObj = new User({username: username, authId: profile.id})
					new User(userObj).save(function (err, usr){
						if(err) return console.log(err)
					})
					const profileObj = new Profile({username: username, headline: "login by google", following:[], email: null, zipcode: null, dob: new Date(1999,09,09).getTime(), avatar: "http://talkingpointsmemo.com/images/google-android-mascot.jpg"})
					new Profile(profileObj).save(function (err, usr){
						if(err) return console.log(err)
					})
				}
				return done(null, profile)
			})
		} else {
			//if there is a local login, link them
			redis.hgetall(sid, function(err, userObj) {
				const localUser = userObj.username
				Article.update({author:username}, { $set: { 'author': localUser}}, { new: true, multi: true }, function(){})
				Article.update({'comments.author' : username}, { $set: {'comments.$.author': localUser}}, { new: true, multi: true }, function(){})
				Comment.update({author:username}, { $set: { 'author': localUser}}, { new: true, multi: true }, function(){})
				Profile.findOne({username: username}).exec(function(err, profileData){
					if(profileData){
						const oldFollowingArr = profileData.following
						Profile.findOne({username: localUser}).exec(function(err, newProfile) {
							if(newProfile){
								//concat
								const newFollowingArr = newProfile.following.concat(oldFollowingArr)
								Profile.update({username: localUser}, {$set: {'following': newFollowingArr}}, function(){})
							}
						})
						//delete the profile record
						Profile.update({username: username}, {$set: {'following':[]}}, function(){})
					}
				})
				User.findOne({username: localUser}).exec(function(err, user){
					if(user){
						let authObj = {}
						authObj[`${profile.provider}`] = profile.displayName
						User.update({username: localUser}, {$addToSet: {'auth': authObj}}, {new: true}, function(){})
					}
				})
			})
			return done(null, profile)
		}
	}
))

passport.serializeUser(function(user, done){
	done(null, user.id)
})

passport.deserializeUser(function(id,done){
	User.findOne({authId: id}).exec(function(err, user) {
		done(null, user)
	})
})

function logout(req,res){
	//have bugs 
	if (req.isAuthenticated()) {
		req.session.destroy()
		req.logout()
		//corner case for link acount
		if(req.cookies[cookieKey] !== undefined){
			const sid = req.cookies[cookieKey]
			redis.del(sid)
			res.clearCookie(cookieKey)
		}
		res.status(200).send("OK")
	} else if(req.cookies[cookieKey] !== null){
		const sid = req.cookies[cookieKey]
		redis.del(sid)
		res.clearCookie(cookieKey)
		res.status(200).send("OK")
	}
}

function isLoggedIn(req, res, next){
	// check if third-party authenticated, if not, then check for our session+cookie
	if (req.isAuthenticated()) {
		const usrArr = req.user.username.split('@');
		const authObj = {}
		authObj[`${usrArr[1]}`] = usrArr[0]
		User.findOne({auth: authObj}).exec(function(err,user) {
			if(!user){
				req.username = req.user.username
			} else {
				req.username = user.username
			}
			next()
		})
	} else{
		const sid = req.cookies[cookieKey]
		if (!sid){
	        return res.sendStatus(401)
	    }
	    redis.hgetall(sid, function(err, userObj) {
	    	if(err) throw err;
	    	if(userObj){
	    		console.log(sid + ' mapped to ' + userObj.username)
	    		req.username = userObj.username
				next()
			}
			else{
				res.sendStatus(401)
			}
	    })
	}
	
}

const successFun = (req,res) => {
	res.redirect(originHostUrl)
}

const errorFun = (err,req,res,next) => {
    if(err) {
        res.status(400);
        res.send({err: err.message});
    }
}

const locationFun = (req, res, next) => {
	if(originHostUrl === ''){
		originHostUrl = req.headers.referer
	}
	next()
}

module.exports = app => {
	app.use(cookieParser());

	app.use(locationFun)
	app.use(session({secret:'thisIsMySecretMessage', resave: false, saveUninitialized: false}))
	app.use(passport.initialize())
	app.use(passport.session())
	app.use('/login/facebook', passport.authenticate('facebook', {scope:'email'}))
	app.use('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect:'/login/facebook'}), successFun, errorFun)
	app.use('/login/google', passport.authenticate('google', {scope:'profile'}))
	app.use('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/login/google'}), successFun, errorFun)

    app.post('/login', login);
    app.post('/register', register);

	app.use(isLoggedIn)

	app.use('/link/facebook', passport.authorize('facebook', {scope:'email'}))
	app.use('/link/google', passport.authorize('google', {scope:'profile'}))

	app.post('/unlink', unlink)
	app.post('/merge', merge)
	app.put('/password', newPassword);
	app.put('/logout', logout);
	
}