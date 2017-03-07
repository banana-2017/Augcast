// Lecture.js
// List all lectures of podcast-enabled courses

import React from 'react';
import FA from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import ActionBackup from 'material-ui/svg-icons/action/backup';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import { FormControl } from 'react-bootstrap';

import PodcastView from '../PodcastView.js';
import { displayLecture } from '../../redux/actions';

class UploadButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="upload-button">
                <IconButton tooltip="Upload slides">
                    <ActionBackup />
                </IconButton>
            </div>
        );
    }
}

class LectureList extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {};

        // inherit all course data
        this.course = this.props.navCourse;

        // helper object
        this.calendar = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
        };
    }

    selectLecture(lecture) {
        console.log(lecture);
        console.log(this.course);
        this.props.displayLecture(this.course, lecture);
        browserHistory.push('/' + this.course.id + '/' + lecture.num);
    }

    render () {
        // access to this
        var that = this;

        var listItem = function(lectureID) {
            var lecture = that.props.lectures[lectureID]
            var month = that.calendar[lecture.month];
            return (
                <li key={lecture.id}
                    className={(that.props.currentLecture && lecture.id == that.props.currentLecture.id) ? 'lecture-item selected' : 'lecture-item'}
                    onClick={() => {that.selectLecture(lecture);}}>
                    <div className="lecture-button">
                        Week {lecture.week}, {lecture.day}, {month}/{lecture.date}
                    </div>
                    {!lecture.slides_url && <UploadButton />}
                </li>
            );
        };

        document.title = this.course.dept + " " + this.course.num + " - Augcast";

        return (
            <div>
                <div className="nav">
                    <div className="search-bar">
                        <div className="search-icon"><FA name='arrow-left' onClick={that.props.back}/></div>
                        <FormControl type="text"
                                     placeholder={'Search ' + this.course.dept + ' ' + this.course.num + '...'}
                                     onChange={this.searchInput}
                                     className="search-box" />
                    </div>
                    <div className="lectures-wrapper">
                        <ul className="lecture-list">
                            {that.props.navCourse.lectures.map(listItem)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps (state) {
    return {
        navCourse:  state.navCourse,
        currentLecture:  state.currentLecture
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
