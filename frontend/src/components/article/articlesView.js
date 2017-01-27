
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Article from './article'
import NewArticle from './newArticle'
import { searchKeyword } from './articleActions'

const ArticlesView = ({username, articles, dispatch}) => {  
  let keyword = ''
  return (
    <div className="col-sm-9" >

      <NewArticle/>

      <div className="row">&nbsp;</div>

      <div className="row">
        <div className="col-sm-12">
          <input className="form-control" type="text" id="searchTxt" placeholder="search your feed"
            ref={(node) => keyword = node }
            onChange={() => { dispatch(searchKeyword(keyword.value)) }}/>
        </div>
      </div>

      <div className="row">&nbsp;</div>

      { articles.sort((a,b) => {
        if (a.date < b.date)
          return 1
        if (a.date > b.date)
          return -1
        return 0
      }).map((article) =>
        <Article key={article._id} _id={article._id} username={username} author={article.author}
          date={article.date} text={article.text} img={article.img} avatar={article.avatar}
          comments={article.comments}/>
      )}

    </div>
  )
}

ArticlesView.propTypes = {
  username: PropTypes.string.isRequired,
  articles: PropTypes.arrayOf(PropTypes.shape({
    ...Article.propTypes
  }).isRequired).isRequired
}

// export function filterFunction(articles, keyword){
//   let articleList = Object.keys(articles).map((_id)=> articles[_id]).sort((a,b)=>a.date===b.date?0:a.date<b.date?1:-1);
//   if(keyword && keyword.length !==0){
//     articleList = articleList.filter((item)=>{
//       return item.text.toLowerCase().indexOf(keyword.toLowerCase()) >=0 ||
//            item.author.toLowerCase().indexOf(keyword.toLowerCase()) >=0
//     })
//   }
//   return articleList;
// }
export default connect(
  (state) => {
    const avatars = state.articles.avatars
    const keyword = state.articles.searchKeyword
    let articles = Object.keys(state.articles.articles).map((id) => state.articles.articles[id])
    if (keyword && keyword.length > 0) {
      articles = articles.filter((a) => {
        return a.text.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
               a.author.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
      })
    }
    articles = articles.map((a) => {
      return {...a, avatar: avatars[a.author], comments: a.comments.map((c) => {
        return { ...c, avatar: avatars[c.author] }
      })}
    })
    return {
      username: state.profile.username,
      articles
    }
  }
)(ArticlesView)

export { ArticlesView as PureArticlesView }



/** WEBPACK FOOTER **
 ** ./src/components/article/articlesView.js
 **/