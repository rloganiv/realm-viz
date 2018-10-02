import React from 'react';
import { withRouter } from 'react-router-dom';

import HighlightContainer from './highlight/HighlightContainer.js';
import NelSpan from './NelSpan.js';
import WikiSpan from './WikiSpan.js';


const transform = (tokens, entities, nel) => {
    let enhancedTokens = [];

    // Start by creating an object for each token.
    tokens.forEach((sentence, i) => {
        sentence.forEach((word, j) => {
            enhancedTokens.push({
                text: word,
                type: 'plain',
                mergeBackward: false,
                data: null
            });
        });
    });

    // Annotate wikientities
    entities.forEach((tuple, i) => {
        var inside = false;
        for (var j=tuple[1]; j<tuple[2]; j++) {
            enhancedTokens[j].type = 'wikilink';
            enhancedTokens[j].data = tuple[0];
            if ( inside ) {
                enhancedTokens[j].mergeBackward = true;
            }
            inside = true;
        }
    });
    
    // Annotate entity linker results
    nel.forEach((result, i) => {
        var wikilink = false;
        for (var j=result.start; j<result.end; j++) {
            if (enhancedTokens[j].type === 'wikilink'){
                wikilink = true;
                break
            }
        }
        if ( !wikilink ) {
            var inside = false;
            for (var j=result.start; j<result.end; j++) {
                enhancedTokens[j].type = 'nel';
                enhancedTokens[j].data = [{url: result.label, score: result.score}];
                if ( inside ) {
                    enhancedTokens[j].mergeBackward = true;
                }
                inside = true;
            }
        }
    });

    // Merge tokens
    let out = [];
    var prevToken;
    enhancedTokens.forEach((token, i) => {
        if ( token.mergeBackward ) {
            prevToken.text = (prevToken.text+' '+token.text);
        } else {
            out.push(token);
            prevToken = token;
        }
    });

    return out;
}


class _EntityComponent extends React.Component {
    render() {
        const { responseData } = this.props;

        const tokens = responseData && responseData.tokens;
        const entities = responseData && responseData.entities;
        const nel = responseData && responseData.nel;

        const spanWrapper = (spans) => {
            return spans.map((span, i) =>
                span.type === 'wikilink' ? (
                    <WikiSpan key={i} text={span.text} entity={span.data} />
                ) : span.type === 'nel' ? (
                    <NelSpan key={i} text={span.text} entities={span.data} />
                ) : (
                    <span key={i}>{span.text} </span>
                )
            );
        }

        if ( responseData ) {
            const spans = transform(tokens, entities, nel);
            return (
                <HighlightContainer layout="bottom-labels">
                    {spanWrapper(spans)}
                </HighlightContainer>
            )
        } else {
            return (<span>Load more data using the arrow</span>)
        }
    }
}


const EntityComponent = withRouter(_EntityComponent);

export default EntityComponent;
