import React from 'react';
import {MenuItem} from 'react-toolbox/lib/menu';

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
                <MenuItem className="match-result" key={slide}>
                    <div className="match-slide">{slide}</div>
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
