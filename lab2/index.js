class Model {
    constructor() {
        const date = new Date(Date.now())
        this.articles = [
            { 
                id: 1,
                title: 'Заголовок',
                content: 'Статья',
                date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
                comments: [
                    { author: 'Arkanum', text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.' }
                ]
            },
            { 
                id: 2,
                title: 'Заголовок',
                content: 'Статья',
                date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
                comments: [
                    { author: 'Skyilar', text: 'Lorem ipsum dolor sit amet.' }
                ]
            }
        ]
    }

    addArticle(title, content) {
        const date = new Date(Date.now())
        const article = {
            id: this.articles.length > 0 ? this.articles[this.articles.length-1].id + 1 : 1,
            title,
            content,
            date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
            comments: []
        }

        this.articles.push(article)

        this.onArticlesListChanged(this.articles)
    }

    deleteArticle(id) {
        this.articles = this.articles.filter(article => {
            return article.id !== id
        })

        this.onArticlesListChanged(this.articles)
    }

    addComment(id, author, text) {
        this.articles = this.articles.map(article => {
            return article.id === id ? { id: article.id, title: article.title, content: article.content, date: article.date, comments: [...article.comments, { author, text }] } : article
        })

        this.onArticlesListChanged(this.articles)
    }

    bindArticleListChanged = (callback) => {
        this.onArticlesListChanged = callback
    }
}

class View {
    constructor() {
        this.app = document.querySelector('#root')
        this.addArticleButton = document.querySelector('#add-article')

        this.blog = this.createElement('div')
        this.app.append(this.blog)
    }

    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.className = className

        return element
    }

    displayArticles(articles) {

        while(this.blog.firstChild) {
            this.blog.removeChild(this.blog.firstChild)
        }

        if (articles.length === 0) {
            const p = this.createElement('p')
            p.textContent = 'Нет опубликованных статей.'
            this.blog.append(p)
        }
        else {
            articles.forEach(el => {
                const article = this.createElement('article', 'blog__article')

                const articleHeader = this.createElement('div', 'blog__article__header')
                const deleteButton = this.createElement('button', 'blog__article__delete-btn btn btn-danger btn-sm')
                const articleTitle = this.createElement('h4')
                const articleDate = this.createElement('p')

                const articleContent = this.createElement('p', 'blog__article__text p-1')

                const articleComments = this.createElement('div', 'blog__comments-block p-1')
                const articleCommentsTitle = this.createElement('h4')

                article.id = el.id

                articleTitle.textContent = el.title
                articleHeader.append(articleTitle)
                articleDate.textContent = el.date
                articleHeader.append(articleDate)

                deleteButton.textContent = 'X'
                deleteButton.id = el.id
                articleHeader.append(deleteButton)

                articleContent.textContent = el.content

                articleCommentsTitle.textContent = 'Комментарии'
                articleComments.append(articleCommentsTitle)
                if (el.comments) {
                    el.comments.forEach(comment => {
                        const articleComment = this.createElement('div', 'blog__comment mb-3')
                        const articleCommentHeader = this.createElement('div', 'blog__comment__header')
                        const articleCommentAuthor = this.createElement('h4')
                        const articleCommentText = this.createElement('p')
    
                        articleCommentAuthor.textContent = comment.author
                        articleCommentHeader.append(articleCommentAuthor)
                        articleCommentText.textContent = comment.text
    
                        articleComment.append(articleCommentHeader, articleCommentText)
                        articleComments.append(articleComment)
                    })
                }
                else {
                    const noComments = this.createElement('p')
                    noComments.textContent = 'Нет комментариев.'

                    articleComments.append(noComments)
                }
                const postComment = this.createElement('div')
                const postCommentHeader = this.createElement('label', 'form-label')
                const postCommentArea = this.createElement('textarea', 'form-control mb-2')
                const postCommentButton = this.createElement('button', 'btn btn-primary post-comment')

                postCommentHeader.htmlFor = `comment-area-${el.id}`
                postCommentHeader.textContent = 'Оставить комментарий'
                postComment.append(postCommentHeader)

                postCommentArea.id = `comment-area-${el.id}`
                postCommentArea.rows = '3'
                postComment.append(postCommentArea)

                postCommentButton.id = el.id
                postCommentButton.textContent = 'Написать'
                postComment.append(postCommentButton)

                articleComments.append(postComment)
                article.append(articleHeader, articleContent, articleComments)
                this.blog.append(article)
            })
        }
    }

    bindAddArticle(handler) {
        this.addArticleButton.addEventListener('click', event => {
            const title = prompt('Заголовок статьи')
            const content = prompt('Содержание статьи')

            handler(title, content)
        })
    }

    bindDeleteArticle(handler) {
        this.blog.addEventListener('click', event => {
            if (event.target.className === 'blog__article__delete-btn btn btn-danger btn-sm') {
                handler(parseInt(event.target.id))
            }
        })
    }

    bindAddComment(handler) {
        this.blog.addEventListener('click', event => {
            if (event.target.className === 'btn btn-primary post-comment') {
                const text = document.querySelector(`#comment-area-${parseInt(event.target.id)}`).value
                handler(parseInt(event.target.id), 'Guest', text)
            }
        })
    }
}

class Controller {
    constructor(model, view) {
        this.model = model,
        this.view = view

        this.onArticlesListChanged(this.model.articles)

        this.model.bindArticleListChanged(this.onArticlesListChanged)

        this.view.bindAddArticle(this.handleAddArticle)
        this.view.bindDeleteArticle(this.handleDeleteArticle)
        this.view.bindAddComment(this.handleAddComment)
    }

    onArticlesListChanged = (articles) => {
        this.view.displayArticles(articles)
    }

    handleAddArticle = (title, content) => {
        this.model.addArticle(title, content)
    }

    handleDeleteArticle = (id) => {
        this.model.deleteArticle(id)
    }

    handleAddComment = (id, author, text) => {
        this.model.addComment(id, author, text)
    }
}

const app = new Controller(new Model(), new View())