// Sidebar.js
// Responsible for uploading the PDF

import React from 'react';
import { firebaseApp, storageRef } from './../../database/database_init';
import { ProgressBar, Button, Glyphicon } from 'react-bootstrap';


class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            dataRetrieved: false
        };

        var courseData = undefined;
        var courseNum = undefined;

        var database = firebaseApp.database();
        var that = this;
        database.ref('courses').once('value').then(function(snapshot) {
            that.courseData = snapshot.val();
            that.courseNum = Object.keys(snapshot.val());
            that.setState({dataRetrieved: true});
        });
    }

    render () {
        console.log('Rendering Sidebar');

        // make data accessible in subroutines
        var courseData = this.courseData;

        // render single course item
        var listItem = function(course) {
            var number = course.substring(0, course.length - 6);
            var section = course.substring(course.length - 3);
            var name = courseData[course].name;
            return (
                <li className="course-item" key={course}>
                    <div className="pin-button"></div>
                    <div className="course-title">
                        <span className="course-number">{number}</span>
                        <span className="course-section">{section}</span>
                    </div>
                    <div className="course-name">{name}</div>
                    <div className="expand-button"></div>
                </li>
            );
        }


        return (
            <div className="nav">
                <ul className="unpinned-list">
                    {this.state.dataRetrieved ? this.courseNum.map(listItem) : "wait"}
                </ul>
            </div>
        );
    }
}

export default Sidebar;
