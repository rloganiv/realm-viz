import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { API_ROOT } from '../api-config';

import '../css/Menu.css';


class _Menu extends React.Component {

    constructor(props) {
        super(props);

        const { responseData } = props;

        this.state = { responseData: responseData };

        this.getNextExample = this.getNextExample.bind(this);
    }

    getNextExample(e) {
        fetch(`${API_ROOT}/next`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            const location = {
                state: { responseData: json }
            }
            this.props.history.push(location);
        }).catch((error) => {
            console.error(error);
        });
    }

    render () {

        const { selectedModel } = this.props;

        const buildLink = (thisModel, label) => {
            return (
                <li className={`nav__cell left ${selectedModel === thisModel ? "nav__cell--selected" : ""}`}>
                    <span>
                        <Link to={"/" + thisModel}>
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
                                {buildLink('diff', 'Annotation Differences')}
                                <li className='nav__cell right next__button'>
                                    <span><a onClick={this.getNextExample}>&#8594;</a></span>
                                </li>
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}


const Menu = withRouter(_Menu);

export default Menu;
