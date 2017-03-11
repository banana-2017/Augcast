// Lecture.js
// List all lectures of podcast-enabled courses

import React from 'react';
import FA from 'react-fontawesome';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import { FormControl } from 'react-bootstrap';
import { displayLecture } from '../../redux/actions';
import Fuse from 'fuse.js';

import {database} from '../../../database/database_init';

class LectureList extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            render: (this.props.currentLecture) ? this.props.currentLecture.id : undefined,
            lectures: []
        };

        // inherit all course data
        this.course = this.props.navCourse;
        this.searchInput = this.searchInput.bind(this);
        this.searchForContent = this.searchForContent.bind (this);

        // helper object
        this.calendar = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
        };
    }


    selectLecture(lecture) {
        this.props.displayLecture(this.course, lecture);
        browserHistory.push('/' + this.course.id + '/' + lecture.num);
    }

    searchInput (e) {
        let query = e.target.value;
        let course = this.props.currentCourse.id;
        var that = this;

        // getting array of lectures of this course
        database.ref('/lectures/' + course).once('value').then(function(snapshot) {
            that.setState ({lectures: Object.values(snapshot.val())});
            that.searchForContent(query);
        });
    }

    searchForContent (query) {
        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 70,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['content']
        };

        var fuse = new Fuse(this.state.lectures, options);
        var result = fuse.search(query);
        console.log (result);
        return result;
    }

    render () {
        // access to this
        var that = this;

        var listItem = function(lectureID) {
            var lecture = that.props.lectures[lectureID];
            var month = that.calendar[lecture.month];
            return (
                <li key={lecture.id}
                    className={(that.props.currentLecture && lecture.id == that.props.currentLecture.id) ? 'lecture-item selected' : 'lecture-item'}
                    onClick={() => {that.selectLecture(lecture);}}>
                    Week {lecture.week}, {lecture.day}, {month}/{lecture.date}
                </li>
            );
        };

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
        currentLecture:  state.currentLecture,
        currentCourse: state.currentCourse
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
