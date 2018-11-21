import React from 'react';
import { withRouter } from 'react-router-dom';
import { API_ROOT } from '../api-config';

import HighlightContainer from './highlight/HighlightContainer.js';

import '../css/StoryComponent.css';


function transform(tokens, annotations){
  let spans = [];

  // First add all of the tokens as plain spans
  tokens.forEach((sentence, i) => {
    sentence.forEach((word, j) => {
      spans.push({
        text: word,
        id: null,
        relation: null,
        parent_id: null,
        source: null,
        mergeBackward: false
      })
    });
  });

  // Now add annotations
  annotations.forEach((annotation, i) => {
    var inside = false;
    for (var j=annotation.span[0]; j<annotation.span[1]; j++) {
      spans[j].id = annotation.id;
      spans[j].relation = annotation.relation;
      spans[j].parent_id = annotation.parent_id;
      spans[j].source = annotation.source;
      if ( inside ) {
        spans[j].mergeBackward = true;
      }
      inside = true;
    }
  });

  // Lastly merge spans
  let out = [];
  var prevSpan;
  spans.forEach((span, i) => {
    if ( span.mergeBackward ) {
      prevSpan.text = (prevSpan.text + ' ' + span.text);
    } else {
      out.push(span);
      prevSpan = span;
    }
  });

  let last = {};
  spans.forEach((span, i) => {
    span.idx = i;
    span.parent_idx = last[span.parent_id];
    last[span.id] = i;
  });
  return out
}


class StorySpan extends React.Component {

  render () {
    const { span, onMouseOver, activeIds } = this.props;
    const { text, source, id, idx } = span;

    const sourceLookup = {
      "WIKI": { color: "blue" },
      "NEL": { color: "green" },
      "COREF": { color: "orange" },
      "KG": { color: "fuchsia" }
    }

    const conditionalClasses = `highlight
      ${sourceLookup[source].color}
      ${activeIds && activeIds.includes(idx) ? "active" : ""}`;

    return (
      <div className="storyspan">
        <a href={'https://wikidata.org/wiki/' + id[0]} target='_blank'>
          <span className={conditionalClasses}
              onMouseOver={ onMouseOver ? () => { onMouseOver(span) } : null}>
            <span className="highlight__content">{text}</span>
            <span className="highlight__label"><strong>{source}</strong></span>
            <span className="highlight__tooltip">{id[1]}</span>
          </span>
        </a>
      </div>
    )
  }
}


class InfoBox extends React.Component {

    render() {
        const { span } = this.props;
        if ( span ) {
            return (
                <div className='infobox'>
                <b>Parent Id:</b><span>{span.parent_id[1]}({span.parent_id[0]}) </span>
                <b>Relation:</b><span>{span.relation[1]}({span.relation[0]}) </span>
                <b>Id:</b><span>{span.id[1]}({span.id[0]}) </span>
                </div>
            )
        } else {
            return null;
        }
    }
}

class _StoryComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      activeSpan: null,
      activeIds: null
    };

    this.handleHover = this.handleHover.bind(this);
  }

  handleHover(span) {
    this.setState({
      activeSpan: span,
      activeIds: [span.idx, span.parent_idx]
    });
  }

  render () {

    const { requestData, responseData } = this.props;
    const { activeSpan, activeIds } = this.state;

    const tokens = responseData && responseData.tokens;
    const annotations = responseData && responseData.annotations;

    const spanWrapper = (spans) => {
      return spans.map((span, i) =>
        span.id ? (
          <StorySpan key={i} span={span} activeIds={activeIds} onMouseOver={this.handleHover}/>
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
          <InfoBox span={activeSpan} />
        </div>
      )
    } else {
      return (<span>Load more data using the arrow</span>)
    }
  }
}

const StoryComponent = withRouter(_StoryComponent);

export default StoryComponent;
