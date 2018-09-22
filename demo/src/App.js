import React, { Component } from 'react';
import  { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import EntityComponent from './components/EntityComponent';
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
            responseData: null,
            fileName: null,
            fileLine: null
        };

        // Pass this to Header so it can clear data when model is switched.
        this.clearData = () => {
            this.setState({requestData: null, responseData: null})
        }

        // Callback used by file objects to set the active file.
        this.setFile = (fileName) => {
            console.log(`Setting file to ${fileName}`);
            this.setState({fileName: {fileName}});
        }

        // Components use history.push to change location and attach
        // `requestData` and `responseData` updates to the location object.
        props.history.listen((location, action) => {
            const { state } = location;
            if (state) {
                const { requestData, responseData } = state;
                this.setState({requestData, responseData});
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
                    <Menu selectedModel={selectedModel}
                          clearData={this.clearData}
                          setFile={this.setFile}/>
                    <ModelComponent/>
                </div>
            </div>
        );
    }
}


export default App;
