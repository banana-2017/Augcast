import React from 'react';
import {MenuItem} from 'react-toolbox/lib/menu';
import {connect} from 'react-redux';
import {updateSearchSlides} from '../../redux/actions';

class SearchResultList extends React.Component {
    constructor (props) {
        super (props);

        this.searchResultClicked = this.searchResultClicked.bind (this);
    }

    searchResultClicked () {
        let {updateSearchSlides, selectLecture, resultList} = this.props;
        let matchedSlides = [];

        for (var item in resultList) {
            let result = resultList[item];
            console.log (result);
            matchedSlides.push (result.item.slide);
        }

        updateSearchSlides(matchedSlides);

        // change the podcast view;
        selectLecture();
    }

    render () {
        var {resultList} = this.props;  // resultList is a list of matches foor one lecture
        var that = this;

        var listItem = function (result) {

            let {slide, contents} = result.item;

            let indices = result.matches[0].indices[0];
            let queryStartIndex = indices[0];
            let queryEndIndex = indices[1] + 1;

            // no exact match
            if (queryStartIndex< 0) {
                queryStartIndex = 0;
            }

            // creating prefix
            let prefix = contents.substring (queryStartIndex-50, queryStartIndex);

            if (prefix !== '') {
                prefix = '....' + prefix;
            }
            let queryMatch = contents.substring (queryStartIndex, queryEndIndex);

            // creating suffix
            let suffixEnd = queryEndIndex + 80;
            let sentenceEnd = contents.indexOf ('.', queryEndIndex + 1) + 1;
            if (sentenceEnd > 0) {
                suffixEnd = sentenceEnd;
            }

            let suffix = contents.substring (queryEndIndex, suffixEnd);


            return (
                <MenuItem onClick={that.searchResultClicked} className="match-result" key={slide}>
                    <div className="match-slide">Slide {slide}</div>
                    <div className="match-text">
                        {prefix}<span className="match-highlight">{queryMatch}</span>{suffix}
                    </div>
                </MenuItem>
            );
        };


        // returns array of listItems
        return (
            <div id='list'>
                {(resultList === undefined)?'':resultList.map(listItem)}
            </div>

        );
    }
}


function mapDispatchToProps (dispatch) {
    return {
        updateSearchSlides: (slides) => {
            dispatch (updateSearchSlides(slides));
        }
    };
}

const SearchResultContainer = connect (null, mapDispatchToProps)(SearchResultList);
export default SearchResultContainer;
