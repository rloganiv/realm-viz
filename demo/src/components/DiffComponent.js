import _ from 'underscore';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { API_ROOT } from '../api-config';

import HighlightContainer from './highlight/HighlightContainer.js';

import '../css/NelSpan.css';
import '../css/Highlight.css';


const CHAR_LIMIT = 32;


function transform(tokens, annotations){
  let spans = [];

  // First add all of the tokens as plain spans
  tokens.forEach((sentence, i) => {
    sentence.forEach((word, j) => {
      spans.push({
        text: word,
        source: null,
        annotation1: null,
        annotation2: null,
      })
    });
  });

  // Now add annotations
  annotations.forEach((annotation, i) => {
    for (var j=annotation.span[0]; j<annotation.span[1]; j++) {
      spans[j].annotation1 = annotation.annotations[0]
      spans[j].annotation2 = annotation.annotations[1]
      if (annotation.annotations[0] && annotation.annotations[1]){
        if (_.isEqual(annotation.annotations[0], annotation.annotations[1])) {
          spans[j].source = '&';
        } else {
          spans[j].source = '!=';

        }
      } else if (annotation.annotations[0]) {
        spans[j].source = '1';
      } else if (annotation.annotations[1]) {
        spans[j].source = '2';
      }
    }
  });

  return spans;
}

class Row extends React.Component {

  render () {
    const { alias, annotation } = this.props;
    if (annotation) {
      return (
        <tr>
          <td align="left"><a href={`https://www.wikidata.org/wiki/${annotation.id[0]}`} target="_blank">{alias}</a></td>
          <td align="left">{annotation.parent_id.toString().substring(0, CHAR_LIMIT)}</td>
          <td align="left">{annotation.relation.toString().substring(0, CHAR_LIMIT)}</td>
          <td align="left">{annotation.id.toString().substring(0, CHAR_LIMIT)}</td>
          <td align="left">{annotation.source.toString().substring(0, CHAR_LIMIT)}</td>
        </tr>
      )
    } else {
      return (
        <tr>
          <td align="left">{alias}</td>
          <td align="left">NA</td>
          <td align="left">NA</td>
          <td align="left">NA</td>
          <td align="left">NA</td>
        </tr>
      )
    }
  }
}


class DiffSpan extends React.Component {

  render () {
    const { span, aliases } = this.props;

    const sourceLookup = {
      "1": { color: "blue" },
      "2": { color: "orange" },
      "&": { color: "green" },
      "!=": { color: "red" }
    }

    return (
      <div className="dropdown">
        <span className={`highlight ${sourceLookup[span.source].color} bottom`}>
          <span className="dropdown-text highlight__content">{span.text}</span>
          <span className="highlight__label"><strong>{span.source}</strong></span>
        </span>
        <div className="dropdown-table">
          <table>
            <thead>
              <tr>
                <th>Annotator</th>
                <th>Parent Id</th>
                <th>Relation</th>
                <th>Id</th>
                <th>Source</th>
              </tr>

            </thead>
            <tbody>
              <Row alias={aliases[0]} annotation={span.annotation1}/>
              <Row alias={aliases[1]} annotation={span.annotation2}/>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}


class _DiffComponent extends React.Component {

  render () {

    const { requestData, responseData } = this.props;

    const tokens = responseData && responseData.tokens;
    const annotations = responseData && responseData.annotations;
    const aliases = responseData && responseData.aliases;

    const spanWrapper = (spans) => {
      return spans.map((span, i) =>
        span.source ? (
          <DiffSpan key={i} span={span} aliases={aliases}/>
        ) : (
          <span key={i}>{span.text} </span>
        )
      );
    }

    if ( responseData ) {
      const spans = transform(tokens, annotations);
      return (
        <div>
          <HighlightContainer layout="bottom-labels">
            {spanWrapper(spans)}
          </HighlightContainer>
        </div>
      )
    } else {
      return (<span>Load more data using the arrow</span>)
    }
  }
}

const DiffComponent = withRouter(_DiffComponent);

export default DiffComponent;
