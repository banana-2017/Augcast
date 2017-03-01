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
import LectureList from './Sidebar/LectureList.js';


class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            loading: true
        };

        // course slection variable
        this.courses = undefined;

        // helper object
        this.calendar = { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
                          7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };

        // database query
        var that = this;
        database.ref('courses').once('value').then(function(snapshot) {
            that.courses = snapshot.val();
            that.setState({loading: false});
        });
    }

    render () {

        console.log(this.courses);

        // loading
        if (this.state.loading) {
            return <Spinner className="sidebar-loading" spinnerName="three-bounce" />
        }

        // render lecture list
        if (this.props.CourseID) {
            return <LectureList course={this.courses[this.props.courseID]}
                                courseID={this.props.courseID} />
        }

        // render course list
        else {
            return <CourseList courses={this.courses} />
        }
    }
}

export default Sidebar;
