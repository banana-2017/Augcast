import React from 'react';


class SearchResultList extends React.Component {
    constructor (props) {
        super (props);
    }

    render () {

        var {resultList} = this.props;
        var that = this;
        var listItem = function (result) {

            let {slide, contents} = result;
            let {query} = that.props;

            let startIndex = contents.toLowerCase().indexOf (query.toLowerCase());
            let queryLength = query.length;

            // no exact match
            if (startIndex < 0) {
                startIndex = 0;
                queryLength = 0;
            }
            
            let endIndex = startIndex + queryLength;
            let prefix = contents.substring (0, startIndex);
            let queryMatch = contents.substring (startIndex, endIndex);
            let suffix = contents.substring (endIndex);

            return (
                <div>
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
