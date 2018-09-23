import React from 'react';

import '../css/Highlight.css';
import '../css/WikiSpan.css';


class WikiSpan extends React.Component {
    render() {
        // ``text`` is the literal string.
        // ``entities`` is an array of entity objects.
        //      Each of which has a 'url', and 'score'.
        const { text, entity } = this.props;
        return (
            <div className="wikispan">
                <a href={'http://wikidata.org/wiki/' + entity} target="_blank">
                    <span className="highlight green bottom">
                        <span className="dropdown-text highlight__content">{text}</span>
                        <span className="highlight__label"><strong>WIKI</strong></span>
                    </span>
                </a>
            </div>
        )
    }
}

export default WikiSpan;
