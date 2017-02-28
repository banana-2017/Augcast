// Sidebar.js
// Our Navigation Center

import React from 'react';
import FA from 'react-fontawesome';
import { FormControl } from 'react-bootstrap';
import { database } from './../../database/database_init';
import Spinner from 'react-spinkit';
import Fuse from 'fuse.js';


class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            dataRetrieved: false,
            visibleCourses:undefined    // keys to visible courses
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

        if (this.props.courseID == undefined) {

            database.ref('courses').once('value').then(function(snapshot) {
                that.courses.data = snapshot.val();
                that.courses.keys = Object.keys(snapshot.val());
                that.state.visibleCourses = that.courses.keys;
                that.setState({dataRetrieved: true});

                let arr = [];

                // populating array for search
                for (var course in that.courses.data) {
                    let current = that.courses.data[course];
                    current.key = course;
                    arr.push(current);
                }

                that.dataArray = arr;
            });

        } else {

            database.ref('courses/' + this.props.courseID).once('value').then(function(snapshot) {
                that.course = snapshot.val();
            });

            database.ref('lectures/' + this.props.courseID).once('value').then(function(snapshot) {
                that.lectures = snapshot.val();
                that.setState({dataRetrieved: true});
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


    render () {

        var that = this;

        if (this.props.courseID == undefined) {

            // make data accessible in subroutines
            var courseData = this.courses.data;

            // render single course item
            var listItem = function(id) {
                var course = courseData[id];
                var number = course.dept + ' ' + course.num;
                var section = course.section;
                var prof = course.professor;
                return (
                    <li className="course-item" key={id}>
                        <div className="pin-button"><FA name="star-o" size="2x"/></div>
                        <div className="course-title">
                            <span className="course-number">{number}</span>
                            <span className="course-section">{section}</span>
                        </div>
                        <div className="course-prof">{prof}</div>
                        <div className="expand-button"></div>
                    </li>
                );
            };

            return (
                <div className="nav">
                    <div className="search-bar">
                        <div className="search-icon"><FA name='search' /></div>
                        <FormControl type="text"
                                     placeholder="Filter courses..."
                                     onChange={this.searchInput}
                                     className="search-box" />
                    </div>
                    <div className="course-list">
                        <ul className="unpinned-list">
                            {this.state.dataRetrieved ? this.state.visibleCourses.map(listItem) : <Spinner className="sidebar-loading" spinnerName="three-bounce" /> }
                        </ul>
                    </div>
                </div>
            );

        } else {

            // the selected course
            var courseData = this.course;

            // render single course item
            // var listItem = function(id) {
            //     var course = courseData[id];
            //     var number = course.dept + ' ' + course.num;
            //     var section = course.section;
            //     var prof = course.professor;
            //     return (
            //         <li className="course-item" key={id}>
            //             <div className="pin-button"><FA name="star-o" size="2x"/></div>
            //             <div className="course-title">
            //                 <span className="course-number">{number}</span>
            //                 <span className="course-section">{section}</span>
            //             </div>
            //             <div className="course-prof">{prof}</div>
            //             <div className="expand-button"></div>
            //         </li>
            //     );
            // };

            //         <div className="search-bar">
            //             <div className="search-icon"><FA name='search' /></div>
            //             <FormControl type="text"
            //                          placeholder="Filter courses..."
            //                          onChange={this.searchInput}
            //                          className="search-box" />
            //         </div>
            if (courseData != null) {
                var listItem = function(id) {
                    var lecture = that.lectures[id];
                    var month = that.calendar[lecture.month];
                    return (
                        <li key={id}>
                        </li>
                    );
                }
                return (
                    <div className="nav">
                        <div className="search-bar">
                            <div className="search-icon"><FA name='search' /></div>
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
            } else {
                return (
                    <div></div>
                );
            }
        }
    }
}

export default Sidebar;
