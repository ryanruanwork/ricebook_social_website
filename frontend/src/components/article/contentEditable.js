import React, { Component, PropTypes } from 'react'

class ContentEditable extends Component {

    constructor(props) {
        super(props)
        this.emitChange = this.emitChange.bind(this)
    }

    render() {
        return <div className={this.props.className}
            onInput={this.emitChange}
            onBlur={this.emitChange}
            contentEditable={this.props.contentEditable}
            dangerouslySetInnerHTML={{__html: this.props.html}}
            title={this.props.tooltip}
        ></div>;
    }

    emitChange(e) {
        const html = e.target.innerText
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    }
}

ContentEditable.propTypes = {
    onChange: PropTypes.func.isRequired,
    html: PropTypes.string.isRequired
}

export default ContentEditable



/** WEBPACK FOOTER **
 ** ./src/components/article/contentEditable.js
 **/