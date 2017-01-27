import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { uploadImage } from './profileActions'

class Avatar extends Component {

    componentDidUpdate(oldprops) {
        if (oldprops.img != this.props.img) {
            this.preview = undefined
            this.file = undefined
            this.forceUpdate()
        }
    }

    handleImageChange(e) {
        e.preventDefault()

        let reader = new FileReader();
        reader.onloadend = () => {
            this.preview = reader.result
            this.forceUpdate();
        }

        this.file = e.target.files[0];
        reader.readAsDataURL(this.file)
    }

    render() { return (
        <div className="col-xs-10 col-md-10">
            <div className="col-sm-2"></div>
            <div className="col-sm-8">
                <div className="row">
                    <img width="100%" src={this.props.img}/>
                </div>
                <div className="row">
                    <em>Upload new profile avatar</em>
                    <input type="file" id="avatarImage" accept="image/*" onChange={(e) => this.handleImageChange(e)}/>
                </div>
            { !this.file ? '' :
                <div>
                    <div className="row">
                        <img width="100%" src={this.preview}/>
                    </div>
                    <div>
                        { this.file.webkitRelativePath || this.file.name } ({ parseInt(this.file.size / 1024 * 100)/100.0 } kB)
                    </div>
                    <input className="btn btn-primary" type="button" value="Upload" onClick={() => { 
                        document.getElementById('avatarImage').value = null;
                        this.props.dispatch(uploadImage(this.file)) }}/>
                </div>
            }
            </div>
            <div className="col-sm-2"></div>
        </div>
    )}
}

export default connect(
    (state) => {
        return {
            img: state.profile.avatar
        }
    }
)(Avatar)



/** WEBPACK FOOTER **
 ** ./src/components/profile/avatar.js
 **/