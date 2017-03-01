// CourseList.js
// List all podcast-enabled courses

import React from 'react';
import FA from 'react-fontawesome';
import { browserHistory } from 'react-router';
import { FormControl } from 'react-bootstrap';
import { database } from './../../../database/database_init';
import Fuse from 'fuse.js';

class CourseList extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            display: 'loading courses data',
            visibleCourses: []    // keys to visible courses
        };

        this.search = this.search.bind(this);
        this.searchInput = this.searchInput.bind(this);

        // lecture slection variable
        this.dataArray = [];

        // inherit all course data
        this.courses = this.props.courses;
        this.state.visibleCourses = Object.keys(this.courses)

        // populate array for search
        for (var course in this.courses) {
            let current = this.courses[course];
            current.key = course;
            this.dataArray.push(current);
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

    render () {

        // make data accessible in subroutines
        var courses = this.courses;

        // access to this
        var that = this;

        // render single course item
        var listItem = function(id) {
            var course = courses[id];
            var number = course.dept + ' ' + course.num;
            var section = course.section;
            var prof = course.professor;
            return (
                <li className="course-item" key={id} onClick={() => {that.routeToLecture(id);}}>
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
                        {this.state.visibleCourses.map(listItem)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default CourseList;
