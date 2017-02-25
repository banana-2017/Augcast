// Sidebar.js
// Responsible for uploading the PDF

import React from 'react';
import FA from 'react-fontawesome';
import { firebaseApp} from './../../database/database_init';
import {FormControl} from 'react-bootstrap';
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

        this.courseData = undefined;
        this.courseNum = undefined;         // keys to all courses
        this.dataArray = [];

        var database = firebaseApp.database();
        var that = this;
        database.ref('courses').once('value').then(function(snapshot) {
            that.courseData = snapshot.val();
            that.courseNum = Object.keys(snapshot.val());
            that.state.visibleCourses = that.courseNum;
            that.setState({dataRetrieved: true});

            let arr = [];
            console.log (that.courseData);

            // populating array for search
            for (var course in that.courseData) {
                let current = that.courseData[course];
                current.key = course;
                arr.push(current);
            }

            that.dataArray = arr;
            console.log (that.dataArray);

        });
    }

    // search course
    search (query) {
        console.log (query);
        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 56,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['key', 'professor', 'title']
        };

        var fuse = new Fuse(this.dataArray, options);
        var result = fuse.search(query);
        return result;
    }

    searchInput (e) {
        let query = e.target.value;

        // empty query
        if (query === '') {
            this.setState({visibleCourses:this.courseNum});
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
        console.log('Rendering Sidebar');

        // make data accessible in subroutines
        var courseData = this.courseData;

        // render single course item
        var listItem = function(course) {
            console.log ("called with" + course);
            var number = course.substring(0, course.length - 6);
            var section = course.substring(course.length - 3);
            var prof = courseData[course].professor;
            return (
                <li className="course-item" key={course}>
                    <div className="pin-button"><FA name='rocket' size='2x'/></div>
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

                <FormControl
                            type="text"
                            placeholder="Search"
                            onChange={this.searchInput}
                          />
                <ul className="unpinned-list">
                    {this.state.dataRetrieved ? this.state.visibleCourses.map(listItem) : <Spinner className="loadingSideBar" spinnerName="three-bounce" /> }
                </ul>
            </div>
        );
    }
}


export default Sidebar;
