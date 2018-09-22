import React from 'react';
import { withRouter } from 'react-router-dom';

import { API_ROOT } from '../api-config';
import HighlightContainer from './highlight/HighlightContainer.js';
import NelSpan from './NelSpan.js';
import WikiSpan from './WikiSpan.js';

const neltext = "John Adams";
const nelentities = [
    {url: "https://en.wikipedia.org/wiki/John_Adams", score:0.99},
    {url: "https://en.wikipedia.org/wiki/John_Adams_(New_York)", score:0.01}
];

const wikitext = "President";
const wikientity = "Q11696";


class _EntityComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            response: null
        };

        this.getData = this.getData.bind(this);
    }

    getData(e) {
        fetch(`${API_ROOT}/data`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        }).then(function (response) {
            return response.json();
        })
    }

    render() {
        return (
            //<p>This will render "{this.props.fname}" someday</p>
            <HighlightContainer layout="bottom-labels">
                <WikiSpan text={wikitext} entity={wikientity} />
                <NelSpan text={neltext} entities={nelentities} />
            </HighlightContainer>
        )
    }
}


const EntityComponent = withRouter(_EntityComponent);

export default EntityComponent;
