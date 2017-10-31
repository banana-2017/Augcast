// Lecture.js
// List all lectures of podcast-enabled courses

import React from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import { FormControl } from 'react-bootstrap';
import UploadContainer from '../Upload';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { database } from './../../../database/database_init';

// ui components
import Drawer from 'material-ui/Drawer';
import FA from 'react-fontawesome';
import {MenuItem} from 'react-toolbox/lib/menu';
import SearchResultList from './SearchResultList';

//import PodcastView from '../PodcastView.js';
import { displayLecture } from '../../redux/actions';
import Fuse from 'fuse.js';

import Tooltip from 'react-toolbox/lib/tooltip';
import Button from 'react-toolbox/lib/button';

injectTapEventPlugin();


const TooltipButton = Tooltip(Button);

class LectureStatusIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let url = this.props.lecture.video_url;
        let timestamps = this.props.lecture.timestamps;
        let skip = this.props.lecture.skip;

        if (url != undefined && url.endsWith('.mp3')) {
            return (
                <div className="status-button">
                    <TooltipButton icon="music_note"
                                   className="done-mark"
                                   tooltip="Audio only podcast, no slides or searching available."
                                   tooltipPosition="right"/>
                </div>
            );
        }

        else if (timestamps != undefined) {
            return (
                <div className="status-button">
                    <TooltipButton icon="done"
                                   className="done-mark"
                                   tooltip="Slide extraction complete, contents are searchable!"
                                   tooltipPosition="right"/>
                </div>
            );
        }

        else if (skip != undefined && (skip == true || skip == 'true')) {
            return (
                <div className="status-button">
                    <TooltipButton icon="clear"
                                   className="done-mark"
                                   tooltip="This podcast could not be processed due to its non-slide contents."
                                   tooltipPosition="right"/>
                </div>
            );
        }

        else {
            return (
                <div className="status-button">
                    <TooltipButton icon="cached"
                                   className="done-mark"
                                   tooltip="Processing podcast, slide extraction and content searching will soon be available!"
                                   tooltipPosition="right"/>
                </div>
            );
        }
    }
}

class LectureList extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            render: (this.props.currentLecture) ? this.props.currentLecture.id : undefined,
            lectures: [],
            upload: undefined,
            modal: false,
            visibleLectures: [],
            resultArray: [],
            query: ''
        };

        // decide if week has changed in randering lecture list
        this.week = null;

        // inherit all course data
        this.course = this.props.navCourse;
        this.searchInput = this.searchInput.bind(this);

        // helper object
        this.calendar = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
            'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday',
            'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday'
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount () {

        let course = this.props.navCourse.id;
        var that = this;

        this.setState ({visibleLectures: this.props.navCourse.lectures});

        // getting array of lectures of this course
        database.ref('/lectures/' + course).once('value').then(function(snapshot) {
            let lectureList = snapshot.val();
            let searchData = [];

            for (var lecture  in lectureList) {
                var i = 0;
                for (var slide in lectureList[lecture].contents) {
                    searchData.push ({
                        index: i,
                        lectureId: lecture,
                        slide: slide,
                        contents: lectureList[lecture].contents[slide]
                    });
                    i++;
                }
            }

            // lectures is an array of objects defined as above
            that.setState ({lectures: searchData});
        });
    }


    selectLecture(lecture) {
        // updating redux course/lecture
        this.props.displayLecture(this.course, lecture);
        browserHistory.push('/' + this.course.id + '/' + lecture.num);
    }

    searchInput (e) {
        let query = e.target.value;

        if (query === '') {
            this.setState ({ visibleLectures: this.props.navCourse.lectures, resultArray: []});
            return;
        }
        var options = {
            include: ['matches'],
            shouldSort: true,
            threshold: 0.3,
            minMatchCharLength: 1,
            keys: ['contents']
        };

        var fuse = new Fuse(this.state.lectures, options);

        // result is an array of objects
        var result = fuse.search(query);

        let visibleLectures = [];
        let resultArray = {};

        // for every result
        for (var lecture in result) {

            // note: an element in result has a .item as well as a .matches

            // if a new lecture, push to visiblelectures and create a new object in resultArray
            if (visibleLectures.indexOf(result[lecture].item.lectureId) < 0) {
                visibleLectures.push (result[lecture].item.lectureId);
                resultArray[result[lecture].item.lectureId] = [];
            }

            // storing the search results(object and matches) in an object
            resultArray[result[lecture].item.lectureId].push (
                result[lecture]
            );
        }

        this.setState (
            {visibleLectures: visibleLectures,
                resultArray: resultArray,
                query: query});

        this.week = null;
        return result;
    }

    openModal(lecture) {
        this.setState({upload: lecture, modal: true});
    }

    closeModal() {
        this.setState({upload: undefined, modal: false});
    }

    render () {
        // access to this
        var that = this;

        var listItem = function(lectureID) {
            var lecture = that.props.lectures[lectureID];

            if (lecture == undefined) {
                console.error('LectureID ', lectureID, ' not found in lecture array: ', that.props.lectures, ' Does this key exist in courses/ and not in lectures/ ?');
                return (<div key={lectureID}></div>);
            }

            var month = that.calendar[lecture.month];

            var weekSeparator = null;
            if (that.week != lecture.week) {
                that.week = lecture.week;
                weekSeparator = (<div className="week-separator">Week {lecture.week}</div>);
            }

            return (
                <div className="lecture-wrapper" key={lecture.id}>
                    {weekSeparator}
                    <MenuItem className={(that.props.currentLecture && lecture.id == that.props.currentLecture.id) ? 'lecture-item selected' : 'lecture-item'}>
                        <div className="lecture-button" onClick={() => {that.selectLecture(lecture);}}>
                            <div className="lecture-calendar">
                                <div className="lecture-month">{month}</div>
                                <div className="lecture-date">{lecture.date}</div>
                            </div>
                            <div className="lecture-info">
                                <span className="lecture-day">{that.calendar[lecture.day]}</span>
                            </div>
                        </div>
                        <LectureStatusIcon lecture={lecture}/>
                    </MenuItem>
                    <SearchResultList resultList= {that.state.resultArray[lecture.id]} query = {that.state.query} lecture={lecture} selectLecture={() => {that.selectLecture(lecture);}}/>
                </div>
            );
        };

        // Set page title
        document.title = this.course.dept + ' ' + this.course.num + ' - Augcast';


        return (
            <div className="sidebar">
                <Drawer className="sidebar-drawer">
                    <div className="search-bar">
                        <div className="search-icon"><FA className="back-button" name='arrow-left' onClick={that.props.back}/></div>
                        <FormControl type="text"
                                     placeholder={'Search ' + this.course.dept + ' ' + this.course.num + '...'}
                                     onChange={this.searchInput}
                                     className="search-box" />
                    </div>
                    <div className="lectures-wrapper">
                        <div className="lecture-list">
                            {that.state.visibleLectures.map(listItem)}
                            <div className="end-of-line">end of results</div>
                        </div>
                    </div>
                </Drawer>
                <UploadContainer username={this.props.username}
                                 lecture={this.state.upload}
                                 open={this.state.modal} close={this.closeModal}/>
            </div>
        );
    }
}


function mapStateToProps (state) {
    return {
        navCourse:  state.navCourse,
        currentLecture:  state.currentLecture,
        currentCourse: state.currentCourse,
        username: state.username
    };
}

function mapDispatchToProps (dispatch) {
    return {
        displayLecture: (currentCourse, currentLecture) => {
            dispatch (displayLecture(currentCourse, currentLecture));
        }

    };
}

const LectureListContainer = connect (mapStateToProps, mapDispatchToProps)(LectureList);
export default LectureListContainer;
