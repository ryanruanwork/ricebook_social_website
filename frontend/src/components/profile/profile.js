import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ProfileForm from './profileForm'
import LinkAccountForm from './linkAccountForm'
import LinkThirdPartyBtn from './linkThirdPartyBtn'
import UnlinkBtn from './unlinkBtn'
import Avatar from './avatar'

const Messages_ = ({error, success}) => (
     <div className="row">
        <div className="col-sm-10">
            { error.length == 0 ? '' :
                <div className="alert alert-danger">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10" id="errorMessage">{error}</div>
                    <div className="col-sm-1"></div>
                    <div className="row">&nbsp;</div>
                </div>
            }
            { success.length == 0 ? '' :
                <div className="alert alert-success">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10" id="successMessage">{success}</div>
                    <div className="col-sm-1"></div>
                    <div className="row">&nbsp;</div>
                </div>
            }
        </div>
        <div className="col-sm-2">&nbsp;</div>
    </div>
)

Messages_.propTypes = {
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired
}

const Messages = connect(
    (state) => {
        return {
            error: state.common.error,
            success: state.common.success,
        }
    }
)(Messages_)

const Profile = () => {
    return (
        <div>
            <div className="row">&nbsp;</div>
            <div className="row">&nbsp;</div>
            <div className="row">&nbsp;</div>
            <div className="col-xs-4 col-md-4">
            <Avatar/>
            </div>
            <div className="col-xs-8 col-md-8">
                <Messages/>
                <ProfileForm/>
                <LinkAccountForm/>
                <LinkThirdPartyBtn/>
                <UnlinkBtn/>
            </div>
        </div>
    )
}
export default Profile



/** WEBPACK FOOTER **
 ** ./src/components/profile/profile.js
 **/