import React from 'react';
import '../css/DropdownSpan.css';
import '../css/Highlight.css';


class WikiSpan extends React.Component {
    render() {
        // ``text`` is the literal string.
        // ``entities`` is an array of entity objects.
        //      Each of which has a 'url', and 'score'.
        const { text, entity } = this.props;
        return (
            <span className="highlight green bottom">
                <a href={'http://wikidata.org/wiki/' + entity} target="_blank">
                <span className="dropdown-text highlight__content">{text}</span>
                </a>
                <span className="highlight__label"><strong>WIKI-ENT</strong></span>
            </span>
        )
    }
}

export default WikiSpan;
