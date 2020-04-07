import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import css from './breadcrumb.css';

class FileListBreadcrumb extends React.Component {
    static propTypes = {
        path: PropTypes.string.isRequired
    };

    render() {
        const pathParts = this.props.path.split('/');
        const toShow = pathParts.slice(0,pathParts.length-1);
        const lastElem = toShow.length-1;

        return <ul className="breadcrumb-list">
            {
                toShow.map((part,idx)=><li className="breadcrumb-entry">
                    <FontAwesomeIcon icon="folder" className="folder-icon breadcrumb-icon-padding"/>
                    {part}
                    {
                        idx===lastElem ? "" : <FontAwesomeIcon icon="greater-than" className="breadcrumb-end-padding"/>
                    }
                </li>)
            }
        </ul>
    }
}

export default FileListBreadcrumb;