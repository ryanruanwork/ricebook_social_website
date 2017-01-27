'use strict'
// this is dbarticle.js 
var Article = require('./model.js').Article

function find(req, res) {
     findByAuthor(req.params.user, function(items) {
          res.send({items})
     })
}

module.exports = (app) => {
     app.get('/find/:user', find)
}


function findByAuthor(author, callback) {
	Article.find({ author: author }).exec(function(err, items) {
		console.log('There are ' + items.length + ' entries for ' + author)
		let totalLength = 0
		items.forEach(function(article) {
			totalLength += article.text.length
		})
		console.log('average length', totalLength / items.length)		
		callback(items)
	})
}
