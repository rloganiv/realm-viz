import React from 'react';
// import { Highlight } from './highlight/Highlight.js';
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


class Demo extends React.Component {
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


export default Demo;
