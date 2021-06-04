const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Article = require('./article')

mongoose.connect('mongodb://127.0.0.1:27017/remus', { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE")
    next();
});

app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find({})
        if (articles) {
            res.send(articles)
        }
        else {
            res.send({ error: 'Not found.' })
        }
    }
    catch (e) {
        res.status(500).send(e)
    }
})

app.post('/articles', async (req, res) => {
    try {
        const article = new Article(req.body)
        await article.save()

        res.status(201).send(article)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

app.post('/articles/comment/:id', async (req, res) => {
    try {
        const article = await Article.findOne({ id: req.params.id })
        article.comments.push(req.body)
        await article.save()

        res.send(article)
    }
    catch (e) {

    }
})

app.delete('/articles/:id', async (req ,res) => {
    try {
        const article = await Article.findOne({ id: req.params.id })
        await article.remove()

        res.send(article)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

app.listen(25565, () => {
    console.log('Success.')
})