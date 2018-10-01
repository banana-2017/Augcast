import React from 'react';
import {MenuItem} from 'react-toolbox/lib/menu';
import {connect} from 'react-redux';
import {updateSearchSlides} from '../../redux/actions';

import Tooltip from 'react-toolbox/lib/tooltip';

const TooltipMenuItem = Tooltip(MenuItem);
class SearchResultList extends React.Component {
    constructor (props) {
        super (props);

        this.searchResultClicked = this.searchResultClicked.bind (this);
    }

    /**
     * updates redux state with
     * 1. all slides of the lecture that matched
     * 2. exact slide that was clicked
     *
     * also calls selectLecture to update PodcastView (check selectLecture in
     * LectureList)
     */
    searchResultClicked (slide) {
        let {updateSearchSlides, selectLecture} = this.props;
        let matchedSlides = [];

        // getting all matched slides
        /*
        for (var item in resultList) {
            let result = resultList[item];
            matchedSlides.push (result.item.slide);
        }
        */

        updateSearchSlides(matchedSlides, slide);
        // change the podcast view;
        selectLecture();
    }

    render () {
        var {resultList, lecture} = this.props;  // resultList is a list of matches foor one lecture
        var that = this;

        var listItem = function (result) {

            let {slide, contents} = result.item;

            let indices = result.matches[0].indices[0];
            let queryStartIndex = indices[0];
            let queryEndIndex = indices[1] + 1;
            let formatTime = undefined;

            if (lecture !== undefined && lecture.timestamps[slide] != -1 && lecture.timestamps[slide] !== undefined) {
                let result = lecture.timestamps[slide];
                formatTime = Math.floor(result/60) + ':' + (('0' + (result%60)).slice(-2));
            }

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

            let tooltip = (formatTime) ? 'Skip to ' + formatTime : 'Slide not synced';


            return (
                <TooltipMenuItem onClick={() => {that.searchResultClicked(slide);}}
                                 tooltip={tooltip}
                                 tooltipPosition="right"
                                 className="match-result"
                                 key={slide} >
                    <div className="match-slide">Slide {slide} &nbsp; Time {(formatTime !== undefined)?formatTime:'N/A'}</div>
                    <div className="match-text">
                        {prefix}<span className="match-highlight">{queryMatch}</span>{suffix}
                    </div>
                </TooltipMenuItem>
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
        updateSearchSlides: (slides, slide) => {
            dispatch (updateSearchSlides(slides, slide));
        }
    };
}

function mapStateToProps (state) {
    return {
        currentLecture: state.currentLecture
    };
}

const SearchResultContainer = connect (mapStateToProps, mapDispatchToProps)(SearchResultList);
export default SearchResultContainer;
