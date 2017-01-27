import moment from 'moment'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ContentEditable from './contentEditable'
import { editArticle } from './articleActions'

class Comment extends Component {

    constructor(props) {
        super(props)        
        this.disabled = true
    }

    render() {
        const date = moment(new Date(this.props.date))
        return (
        <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-8">
                <h4>
                    <img className="followingImage" src={ this.props.avatar }/>
                    {this.props.author} commented
                    on {date.format('MM-DD-YYYY')} at {date.format('HH:mm:ss')}
                </h4>
                <ContentEditable className="media-body" html={this.props.text}
                    contentEditable={this.props.username == this.props.author}
                    tooltip={this.props.username == this.props.author ? 'click to edit' : ''}
                    onChange={(e) => {
                        this.newMessage = e.target.value
                        this.disabled = this.props.text == this.newMessage
                        this.forceUpdate()
                    }}/>
            { this.props.username != this.props.author ? '' :
                <div className="media-right">
                    <span className="btn btn-primary"
                        title="Click the text to edit your comment"
                        disabled={ this.disabled }
                        onClick={() => {
                            this.props.dispatch(editArticle(this.props.articleId, this.newMessage, this.props.commentId))
                            this.disabled = true
                        }}>
                        Update comment
                    </span>
                </div>
            }
            </div>
        </div>
    )}
}

Comment.propTypes = {
    commentId: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    avatar: PropTypes.string,
}

export default connect()(Comment)



/** WEBPACK FOOTER **
 ** ./src/components/article/comment.js
 **/