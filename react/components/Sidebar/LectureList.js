// Lecture.js
// List all lectures of podcast-enabled courses

import React from 'react';
import FA from 'react-fontawesome';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import { FormControl } from 'react-bootstrap';

import PodcastView from '../PodcastView.js';
import {updateCourse} from '../../redux/actions';

class LectureList extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            render: this.props.lectures[this.props.course.lectures[this.props.lectueNum]]
        };

        // this.search = this.search.bind (this);
        // this.searchInput = this.searchInput.bind (this);

        // lecture slection variable
        // this.dataArray = [];

        // inherit all course data
        this.course = this.props.course;
        this.lecture = this.props.lecture;
        // this.state.visibleCourses = this.courses.keys;

        // // populate array for search
        // for (var course in this.courses.data) {
        //     let current = this.courses.data[course];
        //     current.key = course;
        //     this.dataArray.push(current);
        // }

        // helper object
        this.calendar = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
        };
    }

    // // search course
    // search (query) {
    //     var options = {
    //         shouldSort: true,
    //         threshold: 0.6,
    //         location: 0,
    //         distance: 70,
    //         maxPatternLength: 32,
    //         minMatchCharLength: 1,
    //         keys: ['key', 'dept', 'num', 'professor', 'title']
    //     };
    //
    //     var fuse = new Fuse(this.dataArray, options);
    //     var result = fuse.search(query);
    //     return result;
    // }
    //
    // searchInput (e) {
    //     let query = e.target.value;
    //
    //     // empty query
    //     if (query === '') {
    //         this.setState({visibleCourses:this.courseIDs});
    //         return;
    //     }
    //
    //     let searchResults = this.search (query);
    //     let visibleCourses = [];
    //     for (var index in searchResults) {
    //         visibleCourses.push (searchResults[index].key);
    //     }
    //     this.setState({visibleCourses:visibleCourses});
    // }
    //
    // routeToLecture(id) {
    //     this.setState({display: 'loading lectures data'});
    //     browserHistory.push('/' + id);
    // }

    selectLecture(lecture) {
        browserHistory.push('/' + this.course.id + '/' + lecture.num);
        this.props.updateCourseState(this.course, lecture);
        this.setState({render: lecture.id});
    }

    render () {
        // access to this
        var that = this;

        var listItem = function(lectureID) {
            var lecture = that.props.lectures[lectureID]
            var month = that.calendar[lecture.month];
            return (
                <li key={lecture.id}
                    className={(lecture.id == that.state.render) ? 'lecture-item selected' : 'lecture-item'}
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
                            {that.course.lectures.map(listItem)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps (state) {
    return {
        currentCourse:  state.currentCourse,
        currentLecture: state.currentLecture
    };
}

function mapDispatchToProps (dispatch) {
    return {
        updateCourseState: (course, lectureNum) => {
            dispatch (updateCourse (course, lectureNum));
        }
    };
}

const LectureListContainer = connect (mapStateToProps, mapDispatchToProps)(LectureList);
export default LectureListContainer;
