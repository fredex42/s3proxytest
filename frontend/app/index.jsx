import React from "react";
import {render} from 'react-dom';
import RecursiveTree from "./RecursiveTree.jsx";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import maincss from './mainpage.css';
import {library} from "@fortawesome/fontawesome-svg-core";
import {faFolder, faFolderOpen,faFileAlt, faFile, faSpinner} from "@fortawesome/free-solid-svg-icons";

library.add(faFolder, faFolderOpen, faFileAlt, faFile, faSpinner);

class App extends React.Component {
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

    customURIDecode(str) {
        const decoded = decodeURIComponent(str);
        const space_replaced = decoded.replace('+',' ');
        return space_replaced;
    }

    loadDidError(err) {
        this.setState({loading: false, lastError: err})
    }

    userDidSelect(newFileList) {
        this.setState({
            knownFiles: newFileList
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
                <ul className="file-list">
                    {
                        this.state.knownFiles.map((fileRec,idx)=>fileRec ? <li key={idx}>{this.customURIDecode(fileRec.Key)}</li> : <li key={idx}>(null entry)</li>)
                    }
                </ul>
                { this.state.knownFiles.length===0 ? <span className="error">No files found here</span> : <span/> }
            </div>
        </div>
    }
}

render(<App/>, document.getElementById('app'));