import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { addFollower, delFollower, dispatch } from './followingActions'

const Follower = ({name, avatar, headline, dispatch}) => (
    <div className="row" name="follower">
        <div>&nbsp;</div>
        <div className="row">
            <img className="followingImage" src={ avatar }/>
        </div>
        <div className="row">
            <div><strong>{ name }</strong></div>
            <div><em>{ headline }</em></div>
        </div>
        <div className="row">
            <button className="btn btn-danger" id="unfollowBtn" onClick={() => { dispatch(delFollower(name)) }}>Unfollow</button>
        </div>
    </div>
)

Follower.propTypes = {
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    headline: PropTypes.string,
    dispatch: PropTypes.func.isRequired
}

class Following extends Component {
    render() { return (
        <div>
            <div className="col-sm-2">&nbsp;</div>
            <div className="col-sm-8" id="followersList">
                { Object.keys(this.props.followers).sort().map((f) => this.props.followers[f]).map((follower) =>
                    <Follower key={follower.name}
                        name={follower.name} avatar={follower.avatar} headline={follower.headline}
                        dispatch={this.props.dispatch} />
                )}
                <div className="row">&nbsp;</div>
                <div className="row">
                    <input className="form-control" type="text"
                        id="newFollowerTxt"
                        placeholder="add a follower"
                        ref={(node) => this.newFollower = node }
                        onChange={(e) => {
                            this.forceUpdate()
                        }}/>
                { !(this.newFollower && this.newFollower.value && this.newFollower.value.length > 0) ? '' :
                    <input className="btn btn-primary" type="button" id="newFollowerBtn"
                        onClick={() => {
                            this.props.dispatch(addFollower(this.newFollower.value))
                            this.newFollower.value = ''
                            this.forceUpdate()
                        }}
                        value="add follower"/>
                }
                { this.props.error.length == 0 ? '' :
                    <div className="alert alert-danger">
                        { this.props.error }
                    </div>
                }
                </div>
            </div>
            <div className="col-sm-2">&nbsp;</div>
        </div>
    )}
}

Following.propTypes = {
    error: PropTypes.string.isRequired,
    followers: PropTypes.object.isRequired
}

export default connect(
    (state) => {
        return {
            error: state.common.error,
            followers: state.followers.followers
        }
    }
)(Following)



/** WEBPACK FOOTER **
 ** ./src/components/main/following.js
 **/