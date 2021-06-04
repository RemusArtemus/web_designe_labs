const date = new Date(Date.now())
const app = new Vue({
    el: '#root',
    data: {
        articles: []
    },
    mounted() {
        fetch('http://localhost:25565/articles')
        .then(res => res.json())
        .then(data => this.articles = data)
    },
    methods: {
        addArticle: function () {
            const title = prompt('Заголовок')
            const text = prompt('Содержание')
            const date = new Date(Date.now())

            fetch('http://localhost:25565/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                        id: this.articles.length > 0 ? this.articles[this.articles.length-1].id + 1 : 1,
                        title,
                        text,
                        date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
                        comments: []
                })
            })
            .then(() => {
                fetch('http://localhost:25565/articles')
                .then(res => res.json())
                .then(data => this.articles = data)
            })
        },
        deleteArticle: function (id) {
            fetch('http://localhost:25565/articles/' + id, {
                method: 'DELETE'
            })
            .then(() => {
                fetch('http://localhost:25565/articles')
                .then(res => res.json())
                .then(data => this.articles = data)
            })
        },
        addComment: function (id) {
            const area = document.querySelector(`#comment-area-${id}`)
            
            fetch('http://localhost:25565/articles/comment/' + id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    author: 'Guest',
                    text: area.value
                })
            })
            .then(() => {
                fetch('http://localhost:25565/articles')
                .then(res => res.json())
                .then(data => this.articles = data)
            })

            area.value = ''
        }
    }
})