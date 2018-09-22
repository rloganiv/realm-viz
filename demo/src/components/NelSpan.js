import React from 'react';
import '../css/NelSpan.css';
import '../css/Highlight.css';


class NelSpan extends React.Component {
    render() {
        // ``text`` is the literal string.
        // ``entities`` is an array of entity objects.
        //      Each of which has a 'url', and 'score'.
        const { text, entities } = this.props;
        return (
            <div className="dropdown">
                <span className="highlight blue bottom">
                    <span className="dropdown-text highlight__content">{text}</span>
                    <span className="highlight__label"><strong>NEL-ENT</strong></span>
                </span>
                <div className="dropdown-table">
                    <table>
                        <tbody>
                          {entities.map((entity, i) =>
                              <tr key={i}>
                                  <td align="left"><a href={entity.url} target="_blank">{entity.url}</a></td>
                                  <td align="left">{entity.score}</td>
                              </tr>
                          )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default NelSpan;
