import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FileListBreadcrumb from "./FileListBreadcrumb.jsx";

class FileList extends React.Component {
    static propTypes = {
        knownFiles: PropTypes.array.isRequired,
        selectedPath: PropTypes.string.isRequired,
        showFullPath: PropTypes.bool
    };

    customURIDecode(str) {
        const decoded = decodeURIComponent(str);
        const space_replaced = decoded.replace('+',' ');
        return space_replaced;
    }

    labelForDisplay(fileRec) {
        if(this.props.showFullPath) {
            return this.customURIDecode(fileRec.Key);
        } else {
            const parts = fileRec.Key.split('/');
            const required = parts.length>1 ? parts.length -1 : 0;
            return this.customURIDecode(parts[required]);
        }
    }

    render() {
        const fileList = this.props.knownFiles.filter(value=>value!==null);

        return <div className="file-list-widget">
            <div className="file-list-banner">
                <FileListBreadcrumb path={this.props.selectedPath}/>
            </div>
            <div className="file-list">
                <ul className="file-list">
                    {
                        fileList.map((fileRec,idx)=><li key={idx}><FontAwesomeIcon icon="file-alt" className="file-icon icon-padding"/>{this.labelForDisplay(fileRec)}</li>)
                    }
                </ul>
                { fileList.length===0 ? <span className="error">No files in this folder.<br/>Choose another folder in the list to the left by clicking on it.</span> : <span/> }
            </div>
        </div>
    }
}

export default FileList;