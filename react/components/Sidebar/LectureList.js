// Lecture.js
// List all lectures of podcast-enabled courses

import React from 'react';
import FA from 'react-fontawesome';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import { FormControl } from 'react-bootstrap';
import Spinner from 'react-spinkit';

import PodcastView from '../PodcastView.js';
import {updateCourse} from '../../redux/actions';
import { database } from './../../../database/database_init';

class LectureList extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            loading: true,
            // visibleCourses: []    // keys to visible courses
        };

        // this.search = this.search.bind (this);
        // this.searchInput = this.searchInput.bind (this);

        // lecture slection variable
        // this.dataArray = [];

        // inherit all course data
        this.course = this.props.course;
        this.lectures = undefined;
        // this.state.visibleCourses = this.courses.keys;

        // // populate array for search
        // for (var course in this.courses.data) {
        //     let current = this.courses.data[course];
        //     current.key = course;
        //     this.dataArray.push(current);
        // }

        // database query
        var that = this;
        database.ref('lectures/' + this.props.courseID).once('value').then(function(snapshot) {
            that.lectures = snapshot.val();
            that.setState({loading: false});
        });

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

    back() {
        this.setState({display: 'courses'});
        browserHistory.push('/test');
    }

    renderLecture(id) {
        browserHistory.push('/' + this.props.courseID + '/' + id);
        this.props.updateCourseState (this.props.courseID, id);
        this.setState({render: id});
    }

    render () {

        // access to this
        var that = this;

        var listItem = function(id) {
            var course = that.course;
            var lecture = that.lectures[id];
            var month = that.calendar[lecture.month];
            return (
                <li key={id} className="lecture-item" onClick={() => {that.renderLecture(id);}}>
                    Week {lecture.week}, {lecture.day}, {month}/{lecture.date}
                </li>
            );
        };

        if (this.state.loading) {
            return (
                <Spinner className="sidebar-loading" spinnerName="three-bounce" />
            );
        } else {
            return (
                <div>
                    <div className="nav">
                        <div className="search-bar">
                            <div className="search-icon"><FA name='arrow-left' onClick={() => {that.back();}}/></div>
                            <FormControl type="text"
                                         placeholder={'Search ' + this.course.dept + ' ' + this.course.num + '...'}
                                         onChange={this.searchInput}
                                         className="search-box" />
                        </div>
                        <div className="lectures-wrapper">
                            <ul className="lecture-list">
                                {that.props.course.lectures.map(listItem)}
                            </ul>
                        </div>
                    </div>
                    {this.props.lectureID && <PodcastView courseID={this.props.course.key} lecture={this.lectures[this.state.render]} lectureID = {this.state.render}/>}
                </div>
            );
        }
    }
}


function mapDispatchToProps (dispatch) {
    return {
        updateCourseState: (courseId, lectureId) => {
            dispatch (updateCourse (courseId, lectureId));
        }
    };
}

const LectureListContainer = connect (null, mapDispatchToProps)(LectureList);
export default LectureListContainer;
