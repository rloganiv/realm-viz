import React, { Component } from 'react';
import  { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import EntityComponent from './components/EntityComponent';
import CorefComponent from './components/CorefComponent';
import Menu from './components/Menu';
import logo from './logo.svg';

import './css/App.css';


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

        this.state = {
            selectedModel: model,
            requestData: null,
            responseData: null
        };

        // Components use history.push to change location and attach
        // `requestData` and `responseData` updates to the location object.
        props.history.listen((location, action) => {
            const { state } = location;
            if (state) {
                const { responseData } = state;
                this.setState({responseData});
            }
        });
    }

    // Update the state when new props received from React router.
    componentWillReceiveProps({ match }) {
        const { model } = match.params;
        this.setState({selectedModel: model});
    }

    render() {
        const { selectedModel, requestData, responseData } = this.state;

        const ModelComponent = () => {
            if (selectedModel === 'entity'){
                return (<EntityComponent requestData={requestData} responseData={responseData}/>)
            } else if (selectedModel === 'coref'){
                return (<CorefComponent requestData={requestData} responseData={responseData}/>)
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
                    <Menu selectedModel={selectedModel} responseData={responseData}/>
                    <ModelComponent/>
                </div>
            </div>
        );
    }
}


export default App;
