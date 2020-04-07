import React from 'react';
import PropTypes from 'prop-types';
import treecss from './recursive-tree.css';
import FolderIcon from "./FolderIcon.jsx";

class RecursiveTree extends React.Component {
    static propTypes = {
        level: PropTypes.number.isRequired,
        item: PropTypes.string,
        userDidSelect: PropTypes.func.isRequired,
        loadDidError: PropTypes.func.isRequired,
        basePadding: PropTypes.number,
        paddingOffset: PropTypes.number,
        showFullPath: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            isLoaded: false,
            knownDirs: [],
            knownFiles: [],
            continuationToken: null
        };

        this.userSelectedTreenode = this.userSelectedTreenode.bind(this);
    }

    buildUrl() {
        const baseUrl = "/list";
        let args = {};
        if(this.props.item) {
            args["prefix"] = this.props.item.endsWith("/") ? this.props.item : this.props.item + "/";
        }

        if(this.state.continuationToken){
            args["cont"] = this.state.continuationToken;
        }

        if(Object.keys(args).length>0) {
            const argStrings = Object.keys(args).map(k=>k + "=" + encodeURIComponent(args[k]));
            return baseUrl + "?" + argStrings.join("&");
        } else {
            return baseUrl;
        }
    }

    setStatePromise(newstate){
        return new Promise((resolve, reject)=>this.setState(newstate, ()=>resolve()))
    }

    async loadSubDirs() {
        await this.setStatePromise({loading: true});
        const response = await fetch(this.buildUrl());
        switch(response.status) {
            case 200:
                const content = await response.json();
                await this.setStatePromise(prevState=>{
                    const updatedFiles = prevState.knownFiles.length>=1000 ? prevState.knownFiles : prevState.knownFiles.concat(content.files);
                    return {knownDirs: prevState.knownDirs.concat(content.dirs ? content.dirs.map(entry=>entry.Prefix) : []), knownFiles: updatedFiles, continuationToken: content.continuationToken, loading: content.isTruncated}
                });
                if(content.isTruncated){
                    return this.loadSubDirs();
                } else {
                    console.log("load completed");
                    return this.setStatePromise({isLoaded: true, loading: false});
                }
            default:
                const error_content = await response.text();
                this.props.loadDidError(error_content);
        }
    }

    componentDidMount() {
        if(this.props.level===0) { //display root level subfolders at startup
            this.loadSubDirs();
        }
    }

    userSelectedTreenode(evt) {
        console.log("userSelectedTreenode");
        if(!this.state.isLoaded){
            this.loadSubDirs().then(()=>this.props.userDidSelect(this.state.knownFiles)).catch(err=>{
                console.error(err);
                this.props.loadDidError(err);
            });
        } else {
           this.props.userDidSelect(this.state.knownFiles);
        }
    }

    labelForDisplay() {
        if(this.props.item) {
            if(this.props.showFullPath) {
                return this.props.item;
            } else {
                const parts = this.props.item.split("/");
                const idx = parts.length-2;
                console.log(parts);
                console.log(idx);
                return parts[idx];
            }
        } else {
            return "(root)"
        }
    }

    render() {
        const basePadding = this.props.basePadding ? this.props.basePadding : 6;
        const paddingOffset = this.props.paddingOffset ? this.props.paddingOffset : 0;

        const requiredPadding = this.level===0 ? 0 : paddingOffset + (basePadding * this.props.level);
        return <ul className="recursive-tree" style={{paddingLeft: requiredPadding + "px"}}>
            <li key={"tree:" + this.props.level} className="recursive-tree-label clickable" onClick={this.userSelectedTreenode}>
                <FolderIcon isLoading={this.state.loading} isOpen={this.state.isLoaded}/>
                {this.labelForDisplay()}
            </li>
            {
                this.state.knownDirs.map((subpath,idx)=>{
                    console.log("adding ", subpath, idx);
                    const uniqueId = "tree:" + this.props.level + ":" + idx;
                    return <li key={uniqueId}>

                        <RecursiveTree
                            level={this.props.level+1}
                            item={subpath}
                            userDidSelect={this.props.userDidSelect}
                            loadDidError={this.props.loadDidError}
                            basePadding={this.props.basePadding}
                            paddingOffset={this.props.paddingOffset}
                        />
                    </li>
                })
            }
        </ul>
    }
}

export default RecursiveTree;