import React from 'react';
import PropTypes from 'prop-types';
import RecursiveTree from "./RecursiveTree.jsx";
import FileList from "./FileList.jsx";
import maincss from './mainpage.css';

class Browser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            lastError: null,
            knownDirs: [],
            knownFiles: [],
            currentSelectedPath: "",
            continuationToken: null
        };

        this.loadDidError = this.loadDidError.bind(this);
        this.userDidSelect = this.userDidSelect.bind(this);
    }

    loadDidError(err) {
        this.setState({loading: false, lastError: err})
    }

    userDidSelect(newFileList, newPath) {
        console.log("selected ", newFileList.length, " files at  ", newPath);
        const p = newPath ? newPath : "";
        this.setState({
            knownFiles: newFileList,
            currentSelectedPath: newPath
        })
    }

    render() {
        return <div className="browser-container">
            <div className="error-container">
                <span className="error">{this.state.lastError ? this.state.lastError : ""}</span>
                <span className="warning">{this.state.knownFiles.length>=5000 ? "Already showing a maximum of 5,000 files" : ""}</span>
            </div>
            <div className="folder-list-container">
                <RecursiveTree level={0} item={null} userDidSelect={this.userDidSelect} loadDidError={this.loadDidError} paddingOffset={6}/>
            </div>

            <div className="file-list-container">
                <FileList knownFiles={this.state.knownFiles} selectedPath={this.state.currentSelectedPath}/>
            </div>
        </div>
    }
}

export default Browser;