import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

class FolderIcon extends React.Component {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        isLoading: PropTypes.bool.isRequired
    };

    render() {
        if(this.props.isLoading) {
            return <FontAwesomeIcon icon="spinner" className="spinner icon-padding"/>
        } else if(this.props.isOpen) {
            return <FontAwesomeIcon icon="folder-open" className="folder-icon icon-padding"/>
        } else {
            return <FontAwesomeIcon icon="folder" className="folder-icon icon-padding"/>
        }
    }
}

export default FolderIcon;