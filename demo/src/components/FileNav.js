import React from 'react';
import { API_ROOT } from '../api-config';

import '../css/FileNav.css';


class FileListEntry extends React.Component {

    constructor(props) {
        super(props);

        const { fileName, setFile } = props;

        this.state = {
            fileName: fileName,
            setFile: setFile
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        const { fileName, setFile } = this.state;
        setFile(fileName);
    }

    render() {
        const { fileName } = this.state;

        return (
            <a onClick={this.handleClick}>{fileName}</a>
        );
    }
}


class FileLineHandler extends React.Component {
    constructor(props) {
        super(props);
        const { changeLine } = this.props;
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
    }

    increment() {
        const { changeLine } = this.state;
        changeLine(1);
    }

    decrement() {
        const { changeLine } = this.state;
        changeLine(-1);
    }
}


class FileNav extends React.Component {

    constructor() {
        super();

        this.state = {
            options: []
        };
    }

    componentDidMount() {   
        this.fetchOptions();
    }

    fetchOptions() {
        fetch(`${API_ROOT}/list`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
    }).then((response) => {
                return response.json();
            }).then((json) => {
                this.setState({options: json});
            });
    }

    render() {
        const { options } = this.state;
        const { setFile, changeLine } = this.props;

        return (
            <li className="nav__cell right">
            <div className="file-list">
                <button>File list</button>
                <div className="file-list-entries">
                    {options.map((fileName, i) => <FileListEntry key={i} fileName={fileName} setFile={setFile}/>)}
                </div>
            </div>
            </li>
        );
    }

}

export default FileNav;
