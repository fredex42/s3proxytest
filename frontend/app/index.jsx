import React from "react";
import {render} from 'react-dom';
import RecursiveTree from "./RecursiveTree.jsx";

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

    // buildUrl() {
    //     const baseUrl = "/list";
    //     let args = {};
    //     if(this.state.currentSelectedPath && this.state.currentSelectedPath!==""){
    //         args["prefix"] = this.state.currentSelectedPath;
    //     }
    //     if(this.state.continuationToken){
    //         args["cont"] = this.state.continuationToken;
    //     }
    //
    //     if(Object.keys(args).length>0) {
    //         const argStrings = Object.keys(args).map(k=>k + "=" + encodeURIComponent(args[k]));
    //         return baseUrl + "?" + argStrings.join("&");
    //     } else {
    //         return baseUrl;
    //     }
    // }
    //
    // setStatePromise(newstate) {
    //     return new Promise((resolve, reject)=>this.setState(newstate, ()=>resolve()))
    // }
    //
    // async loadNextPage() {
    //     if(!this.state.loading) await this.setStatePromise({loading: true});
    //     const result = await fetch(this.buildUrl());
    //     switch(result.status) {
    //         case 200:
    //             const content = await result.json();
    //             await this.setStatePromise(prevState=>{
    //                 const updatedFiles = prevState.knownFiles.length>=1000 ? prevState.knownFiles : prevState.knownFiles.concat(content.files);
    //                 return {knownDirs: prevState.knownDirs.concat(content.dirs ? content.dirs.map(entry=>entry.Prefix) : []), knownFiles: updatedFiles, continuationToken: content.continuationToken, loading: content.isTruncated}
    //             });
    //             if(content.isTruncated){
    //                 return this.loadNextPage();
    //             } else {
    //                 console.log("load completed");
    //                 return
    //             }
    //         default:
    //             const errorContent = await result.text();
    //             return this.setStatePromise({loading: false, lastError: errorContent})
    //     }
    // }
    //
    // componentDidMount() {
    //     this.loadNextPage();
    // }

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
        return <div>
            <div className="error">
                <span className="error">{this.state.lastError ? this.state.lastError : ""}</span>
                <span className="warning">{this.state.knownFiles.length>=5000 ? "Already showing a maximum of 5,000 files" : ""}</span>
            </div>
            <div className="folder-list">
                <RecursiveTree level={0} item={null} userDidSelect={this.userDidSelect} loadDidError={this.loadDidError}/>
            </div>

            <div className="file-list">
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