'use strict';
//this is the stub for article
const Profile = require('./model.js').Profile
const Article = require('./model.js').Article
const User = require('./model.js').User
const Comment = require('./model.js').Comment
const ObjectId = require('mongoose').Types.ObjectId; 
const md5 = require('md5')
const parseFD = require('./uploadCloudinary')

const getArticle = (req, res) => {
    if(req.params.id) {
        Article.find(ObjectId(req.params.id)).exec(function(err, articles){
        if (!articles || articles.length === 0){
            User.findOne(ObjectId(req.params.id)).exec(function(err, user) {
                if(!user || user.length === 0){
                    res.status(401).send("Don't have this article ID or user ID")
                } else {
                    Article.find({author: user.username}).exec(function(err, articles){
                        res.status(200).send({articles: articles})
                        return
                    })
                }
            })
        } else {
        const articlesObj = articles[0]
        res.status(200).send({articles: articlesObj})
        }
    })}
    else{
        // Article.find({}).exec(function(err, articles){
        // res.status(200).send({articles: articles})
        const username = req.username;
        Profile.find({username: username}).exec(function(err, profile){
            const profileObj = profile[0]
            const usersToQuery = [username, ...profileObj.following]
            Article.find({author: {$in: usersToQuery}}).limit( 10 ).sort('-date').exec(function(err, articles){
                res.status(200).send({articles: articles})
            })
        })
    }
}

const updateArticle = (req, res) => {
    if (!req.params.id) {
    	res.status(400).send('invalid ID!')
    } else {
        Article.find(ObjectId(req.params.id)).exec(function(err, articles){
                if (!articles || articles.length === 0) {
                    res.status(401).send("Don't have this article ID")
                    return
                } else if(req.body.commentId === "-1") {
                    //add comment
                    const commentId = md5(req.username + new Date().getTime())
                    const commentObj = new Comment({commentId: commentId, author: req.username, date: new Date(), text: req.body.text})
                    new Comment(commentObj).save(function (err, comments){
                        if(err) return console.log(err)
                    })
                    Article.findByIdAndUpdate(req.params.id, { $addToSet: {comments: commentObj}}, {upsert: true, new: true},  function(err, articles){})
                    Article.find(ObjectId(req.params.id)).exec(function(err, articles){
                                res.status(200).send({articles: articles})
                    })
                } else if(req.body.commentId){
                    //update comment
                    Comment.find({commentId: req.body.commentId}).exec(function(err, comments){
                        if (!comments || comments.length === 0) {
                            res.status(401).send("Don't have this comment ID")
                            return
                        }else if(comments[0].author !== req.username) {
                            res.status(401).send("you don't own this comment")
                            return
                        }else {
                            Comment.update({commentId: req.body.commentId}, { $set: { text: req.body.text }}, { new: true }, function(err, comments){})
                            Article.update({_id: req.params.id, 'comments.commentId': req.body.commentId}, { $set: { 'comments.$.text': req.body.text }}, { new: true }, function(err, articles){})
                            Article.find(ObjectId(req.params.id)).exec(function(err, articles){
                                res.status(200).send({articles: articles})
                            })
                        }
                    })  
                } else{
                    if (articles[0].author !== req.username) {
                        //forbidden if this user dosen't own this article
                        res.status(401).send("you don't own this article")
                        return
                    }
                    //update articles
                    Article.findByIdAndUpdate(req.params.id, { $set: { text: req.body.text }}, { new: true }, function(err, articles){
                        res.status(200).send({articles: articles});
                    })
                } 
        })
         
    }

}   

const postArticle = (req, res) => {
    const articleObj = new Article({text: req.content, author: req.username, img:req.fileurl, date:new Date(), comments:[]})
    new Article(articleObj).save(function (err, articles){
        if(err) return console.log(err)
        res.status(200).send({articles: [articles]})
    })
}


module.exports = (app) => {
    app.get('/articles/:id?', getArticle)
    app.put('/articles/:id', updateArticle)
    app.post('/article', parseFD('img'), postArticle)
}