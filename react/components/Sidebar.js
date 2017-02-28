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

        this.courseData = undefined;
        this.courseIDs = undefined;         // keys to all courses
        this.dataArray = [];

        // state to render lecture sidebar
        this.lectures = undefined;

        // database query
        var that = this;
        database.ref('courses').once('value').then(function(snapshot) {
            that.courseData = snapshot.val();
            that.courseIDs = Object.keys(snapshot.val());
            that.state.visibleCourses = that.courseIDs;
            that.setState({dataRetrieved: true});

            let arr = [];

            // populating array for search
            for (var course in that.courseData) {
                let current = that.courseData[course];
                current.key = course;
                arr.push(current);
            }

            that.dataArray = arr;
        });

        if (this.props.courseID != undefined) {
            console.log('lectures/' + this.props.courseID);
            database.ref('lectures/' + this.props.courseID).once('value').then(function(snapshot) {
                console.log(snapshot.val());
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

        if (this.props.courseID == undefined) {

            // make data accessible in subroutines
            var courseData = this.courseData;

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
            // var courseData = this.courseData[this.props.courseID];
            console.log(this.courseData);
            //
            // // render single course item
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
            //         <div className="course-list">
            //             <ul className="unpinned-list">
            //                 {this.state.dataRetrieved ? this.state.visibleCourses.map(listItem) : <Spinner className="sidebar-loading" spinnerName="three-bounce" /> }
            //             </ul>
            //         </div>
            return (
                <div className="nav">
                </div>
            );
        }
    }
}

export default Sidebar;
