
// This script logs into the dummy server and logs into your server
// it pulls data from the dummy server and pushes it into your server

var fs = require('fs')
var request = require('request').defaults({jar: true})

var cred = {}
fs.readFile('./cred.json', function(err, data) {	
	var d = JSON.parse(data)	
	Object.keys(d).forEach(function(key) {
		cred[key] = d[key]
	})
	login()
})

function login() {
	request({ url: cred.dummy_url + '/login', method: 'POST',
		json: { "username": cred.dummy_username, "password": cred.dummy_password }
	}, function (err, res, body) {
		if (err || body.result !== "success") {
			console.error("There was an error logging into the dummy server with credentials: " + cred, err)
			process.exit(1)
		}		
		getArticles()
	})
}

var articlesToPost;
function getArticles(cookie) {	
	request({ url: cred.dummy_url + '/articles', method: 'GET', json:true }, function(err, res, body) {
		if (err) {
			console.error("There was an error grabbing articles from the dummy server", err)
			process.exit(1)
		}		
		articlesToPost = body.articles
		console.log("Read " + articlesToPost.length + " articles from dummy server")
		loginToSite()
	})
}

function loginToSite() {
	request({ url: cred.site_url + '/login', method: 'POST',
		json: { "username": cred.site_username, "password": cred.site_password }
	}, function(err, res, body) {
		if (err) {
			console.error("There was an error logging into YOUR server with credentials: " + cred, err)
			process.exit(1)
		}		
		getArticleCount(sendArticles)
	})
}

function sendArticles() {	
	var article = articlesToPost.pop()
	if (article) {		
		request({ url: cred.site_url + '/article', method: 'POST', json: article }, function(err, res, body) {
			if (err) {
				console.error("There was an error POSTing an article to YOUR server.  article=" + article, err)
				process.exit(1)
			}
			sendArticles()
		})
	} else {
		getArticleCount(function() {
			console.log('You now have some data in your database!')
		})
	}
}

function getArticleCount(next) {
	request({ url: cred.site_url + '/articles', method: 'GET', json:true }, function(err, res, body) {
		if (err) {
			console.error("There was an error grabbing articles from YOUR server", err)
			process.exit(1)
		}		
		console.log("Read " + body.articles.length + " articles from YOUR server")
		if (next) {
			next()
		}
	})
}