import React from 'react';
import { Link } from 'react-router-dom';
import FileNav from './FileNav';

import '../css/Menu.css';


class Menu extends React.Component {

    render () {

        const { selectedModel, clearData, setFile } = this.props;

        const buildLink = (thisModel, label) => {
            return (
                <li className={`nav__cell left ${selectedModel === thisModel ? "nav__cell--selected" : ""}`}>
                    <span>
                        <Link to={"/" + thisModel} onClick={clearData}>
                            <span>{label}</span>
                        </Link>
                    </span>
                </li>
            )
        }

        return (
            <div className="menu">
                <div className="menu__content">
                    <nav>
                        <ul>
                                {buildLink('entity', 'Entities')}
                                {buildLink('coref', 'Coreference Clusters')}
                                {buildLink('story', 'Generative Story')}
                                <FileNav setFile={setFile}/>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Menu;
