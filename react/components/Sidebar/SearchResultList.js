import React from 'react';


class SearchResultList extends React.Component {
    constructor (props) {
        super (props);
    }

    render () {

        var {resultList} = this.props;
        var listItem = function (result) {
            return (
                <div>
                    <span>{result.slide}</span>
                    <br/>
                    <span>{result.contents}</span>
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
