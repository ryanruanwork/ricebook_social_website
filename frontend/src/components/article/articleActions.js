import Action, { resource } from '../../actions'

export function fetchArticles() {
    return (dispatch, getState) => {
        resource('GET', 'articles')
        .then((response) => {
            const articles = response.articles.reduce((o,v) => {
                o[v._id] = v
                return o
            }, {})
            dispatch({ type: Action.UPDATE_ARTICLES, articles})

            const avatars = getState().articles.avatars
            const authors = new Set(response.articles.reduce((o, article) => {
                o.push(article.author)
                article.comments.map((c) => c.author).forEach((author) => o.push(author))
                return o
            }, []).filter((author) => !avatars[author]))
            
            resource('GET', `avatars/${[...authors].join(',')}`)
            .then((response) => {
                response.avatars.forEach((s) => {
                    avatars[s.username] = s.avatar
                })
                dispatch({ type: Action.UPDATE_AVATARS, avatars })
            })
        })
    }
}

export function uploadArticle(message, file) {
    return (dispatch) => {
        const fd = new window.FormData()
        fd.append('text', message)
        fd.append('image', file)
        resource('POST', 'article', fd, false)
        .then((response) => {
            const article = response.articles[0]
            dispatch({ type: Action.ADD_ARTICLE, article})
        })
    }
}

export function uploadArticleWithoutImg(message, file) {
    return (dispatch) => {
        const payload = { text: message }
        resource('POST', 'article', payload)
        .then((response) => {
            const article = response.articles[0]
            dispatch({ type: Action.ADD_ARTICLE, article })
        })
    }
}

export function editArticle(articleId, message, commentId) {
    return (dispatch) => {
        const payload = { text: message }
        if (commentId) payload.commentId = commentId
        resource('PUT', `articles/${articleId}`, payload)
        .then((response) => {
            const article = response.articles[0]
            dispatch({ type: Action.EDIT_ARTICLE, article })
        })
    }
}

export function searchKeyword(keyword) {
    return { type: Action.SEARCH_KEYWORD, keyword }
}



/** WEBPACK FOOTER **
 ** ./src/components/article/articleActions.js
 **/