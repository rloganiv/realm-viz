import React, { Component } from 'react';
//import { API_ROOT } from './api-config';
import  { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Entity from './components/Entity';
import logo from './logo.svg';

import './css/App.css';

const queryString = require('query-string');


/* Router wrapped around the Demo component*/

const DEFAULT_PATH = '/entity'

const App = () => (
    <Router>
        <div>
            <Route exact path="/" render={() => (
                <Redirect to={DEFAULT_PATH}/>
            )}/>
            <Route path="/:model?" component={Demo}/>
        </div>
    </Router>
)

class Demo extends Component {

    constructor(props) {
        super(props);

        const { model } = props.match.params;
        const query =  queryString.parse(window.location.search);

        this.state = {
            selectedModel: model,
            fname: query.fname,
            line: query.line
        }
    }

    componentWillReceiveProps({ match }) {
        const { model } = match.params;
        this.setState({selectedModel: model})
    }

    render() {
        const { selectedModel } = this.state;

        const ModelComponent = () => {
            if (selectedModel === 'entity'){
                return (<Entity/>)
            } else {
                return (<h1>Undefined Model</h1>)
            }
        }

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">KGLM Dataset Visualization</h1>
                </header>
                <div className="pane-container">
                    <ModelComponent />
                </div>
            </div>
        );
    }
}


export default App;
