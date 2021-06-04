const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    id: Number,
    title: String,
    text: String,
    date: String,
    comments: [{
        author: String,
        text: String
    }]
})

const Article = mongoose.model('Article', articleSchema)

module.exports = Article