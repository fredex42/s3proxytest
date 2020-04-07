import React from "react";
import {render} from 'react-dom';

import {BrowserRouter, Link, Route, Switch, Redirect, withRouter} from 'react-router-dom';
import {library} from "@fortawesome/fontawesome-svg-core";
import {faFolder, faFolderOpen,faFileAlt, faFile, faSpinner, faGreaterThan} from "@fortawesome/free-solid-svg-icons";
import FileList from "./FileList.jsx";
import Browser from './Browser.jsx';
library.add(faFolder, faFolderOpen, faFileAlt, faFile, faSpinner, faGreaterThan);

class App extends React.Component {
    render() {
        return <Switch>
            <Route path="/browse" component={Browser}/>
            <Route exact path="/" component={()=><Redirect to="/browse"/>}/>
        </Switch>
    }
}

const AppWithRouter = withRouter(App);

render(<BrowserRouter route="/"><AppWithRouter/></BrowserRouter>, document.getElementById('app'));