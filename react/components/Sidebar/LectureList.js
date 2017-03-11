// Lecture.js
// List all lectures of podcast-enabled courses

import React from 'react';
import FA from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
import ActionBackup from 'material-ui/svg-icons/action/backup';
import ActionDone from 'material-ui/svg-icons/action/done';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import { FormControl } from 'react-bootstrap';
import UploadContainer from '../Upload';
import injectTapEventPlugin from 'react-tap-event-plugin';

//import PodcastView from '../PodcastView.js';
import { displayLecture } from '../../redux/actions';

injectTapEventPlugin();

class UploadButton extends React.Component {
    constructor(props) {
        super(props);

        // initial states
        this.state = {};
    }

    render() {
        var that = this;
        return (
            <div className="slides-status">
                <IconButton tooltip="Upload slides" onTouchTap={() => {that.props.onClick(that.props.lecture);}}>
                    <ActionBackup />
                </IconButton>
            </div>
        );
    }
}

class DoneMark extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="slides-status">
                <IconButton tooltip="Slides have been uploaded">
                    <ActionDone />
                </IconButton>
            </div>
        );
    }
}

class LectureList extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            upload: undefined,
            modal: false
        };

        // inherit all course data
        this.course = this.props.navCourse;

        // helper object
        this.calendar = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    selectLecture(lecture) {
        this.props.displayLecture(this.course, lecture);
        browserHistory.push('/' + this.course.id + '/' + lecture.num);
    }

    openModal(lecture) {
        console.log(lecture);
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
            var month = that.calendar[lecture.month];
            return (
                <li key={lecture.id}
                    className={(that.props.currentLecture && lecture.id == that.props.currentLecture.id) ? 'lecture-item selected' : 'lecture-item'}>
                    <div className="lecture-button" onClick={() => {that.selectLecture(lecture);}}>
                        Week {lecture.week}, {lecture.day}, {month}/{lecture.date}
                    </div>
                    {(lecture.slides_url) ? <DoneMark /> : <UploadButton onClick={that.openModal} lecture={lecture}/>}
                </li>
            );
        };

        // Set page title
        document.title = this.course.dept + ' ' + this.course.num + ' - Augcast';

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
                <UploadContainer lecture={this.state.upload} open={this.state.modal} close={this.closeModal}/>
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
