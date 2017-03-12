import React from 'react';
import {MenuItem} from 'react-toolbox/lib/menu';

class SearchResultList extends React.Component {
    constructor (props) {
        super (props);
    }

    render () {
        var {resultList} = this.props;
        var listItem = function (result) {

            let {slide, contents} = result.item;

            let indices = result.matches[0].indices[0];
            let queryStartIndex = indices[0];
            let queryEndIndex = indices[1] + 1;

            // no exact match
            if (queryStartIndex< 0) {
                queryStartIndex = 0;
            }

            console.log (queryStartIndex, queryEndIndex);
            // creating prefix
            let prefix = contents.substring (queryStartIndex-50, queryStartIndex);

            if (prefix !== '') {
                prefix = '....' + prefix;
            }

            let queryMatch = contents.substring (queryStartIndex, queryEndIndex);

            let suffixEnd = queryEndIndex + 80;
            let sentenceEnd = contents.indexOf ('.', queryEndIndex + 1) + 1;
            if (sentenceEnd > 0) {
                suffixEnd = sentenceEnd;
            }

            let suffix = contents.substring (queryEndIndex, suffixEnd);

            return (
                <MenuItem className="match-result" key={slide}>
                    <div className="match-slide">Slide {slide}</div>
                    <div className="match-text">
                        {prefix}<span className="match-highlight">{queryMatch}</span>{suffix}
                    </div>
                </MenuItem>
            );
        };

        return (
            <div id='list'>
                {(resultList === undefined)?'':resultList.map(listItem)}
            </div>

        );
    }
}


export default SearchResultList;
