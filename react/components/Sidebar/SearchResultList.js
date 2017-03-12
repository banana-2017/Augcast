import React from 'react';


class SearchResultList extends React.Component {
    constructor (props) {
        super (props);
    }

    render () {
        var {resultList} = this.props;
        var that = this;
        var listItem = function (result) {

            let {slide, contents} = result.item;
            let {lecture} = that.props;

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
                <div key={(lecture+slide)}>
                    <span>{slide}</span>
                    <br/>
                    <span>{prefix}<strong>{queryMatch}</strong>{suffix}</span>
                </div>
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
