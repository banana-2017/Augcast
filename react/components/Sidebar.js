// Sidebar.js
// Our Navigation Center

import React from 'react';
import { browserHistory } from 'react-router';
import FA from 'react-fontawesome';
import { FormControl } from 'react-bootstrap';
import { database } from './../../database/database_init';
import Spinner from 'react-spinkit';
import Fuse from 'fuse.js';
import CourseList from './Sidebar/CourseList.js';


class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            display: 'loading courses data',
            visibleCourses: undefined    // keys to visible courses
        };

        this.search = this.search.bind (this);
        this.searchInput = this.searchInput.bind (this);

        // course slection variable
        this.courses = {};

        // lecture slection variable
        this.course = undefined;
        this.lectures = {};
        this.dataArray = [];

        // state to render lecture sidebar
        this.lectures = undefined;

        // helper object
        this.calendar = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
                          7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };

        // database query
        var that = this;

        database.ref('courses').once('value').then(function(snapshot) {
            that.courses.data = snapshot.val();
            that.courses.keys = Object.keys(snapshot.val());
            that.state.visibleCourses = that.courses.keys;
            that.setState({display: 'courses'});

            let arr = [];

            // populating array for search
            for (var course in that.courses.data) {
                let current = that.courses.data[course];
                current.key = course;
                arr.push(current);
            }

            that.dataArray = arr;
        });

        if (this.props.courseID != undefined) {
            database.ref('lectures/' + this.props.courseID).once('value').then(function(snapshot) {
                that.lectures = snapshot.val();
                that.setState({display: that.props.courseID});
            });
        }

    }

    // search course
    search (query) {
        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 70,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['key', 'dept', 'num', 'professor', 'title']
        };

        var fuse = new Fuse(this.dataArray, options);
        var result = fuse.search(query);
        return result;
    }

    searchInput (e) {
        let query = e.target.value;

        // empty query
        if (query === '') {
            this.setState({visibleCourses:this.courseIDs});
            return;
        }

        let searchResults = this.search (query);
        let visibleCourses = [];
        for (var index in searchResults) {
            visibleCourses.push (searchResults[index].key);
        }
        this.setState({visibleCourses:visibleCourses});
    }

    routeToLecture(id) {
        this.setState({display: 'loading lectures data'});
        browserHistory.push('/' + id);
    }

    back() {
        this.setState({display: 'courses'});
        browserHistory.push('/test');
    }

    render () {

        console.log('rendering sidebar');

        if (this.state.display == 'loading courses data') {
            return (
                <Spinner className="sidebar-loading" spinnerName="three-bounce" />
            );
        }

        console.log(this.state);
        console.log(this.props);

        var that = this;

        if (this.state.display == 'courses') {

            return (
                <CourseList courses={this.courses} />
            );

        } else {

            // the selected course
            this.course = this.courses.data[this.props.courseID];
            var courseData = this.course;

            if (this.state.display == 'loading lectures data') {
                database.ref('lectures/' + this.props.courseID).once('value').then(function(snapshot) {
                    that.lectures = snapshot.val();
                    that.setState({display: that.props.courseID});
                });
                return (
                    <Spinner className="sidebar-loading" spinnerName="three-bounce" />
                );
            } else {
                var listItem = function(id) {
                    var course = that.course
                    var lecture = that.lectures[id];
                    var month = that.calendar[lecture.month];
                    return (
                        <li key={id}>
                        {course.dept} {course.num}<br/>
                        Week {lecture.week}, {lecture.day}, {month}/{lecture.date}
                        </li>
                    );
                }
                return (
                    <div className="nav">
                        <div className="search-bar">
                            <div className="search-icon"><FA name='arrow-left' onClick={() => {that.back();}}/></div>
                            <FormControl type="text"
                                         placeholder={"Search " + this.course.dept + " " + this.course.num + "..."}
                                         onChange={this.searchInput}
                                         className="search-box" />
                        </div>
                        <div className="lectures-wrapper">
                            <ul className="lecture-list">
                                {this.course.lectures.map(listItem)}
                            </ul>
                        </div>
                    </div>
                );
            }
        }
    }
}

export default Sidebar;
