import React from 'react';
import { database } from './../../database/database_init'
import SplitPane from 'react-split-pane'

/*
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Drawer from 'react-toolbox/lib/drawer';
*/

import AppointInstructor from './AppointInstructor';

class InstructorPanel extends React.Component {
    constructor(props) {
        super(props);
        this.testUser = "l1qiao";

        this.state = {
            dataRetrieved: false,
            currentCourse: undefined
        };

        this.instructorCourses = [];

        // query the database to get instructor courses
        var that = this;
        database.ref('users/' + that.testUser + '/instructorFor').once('value').then(function (snapshot1) {
            let Ids = snapshot1.val();
            let counter = 0;

            for (var index in Ids) {
                database.ref('courses/' + Ids[index]).once('value').then(function(snapshot2){
                    that.instructorCourses.push(snapshot2.val());

                    // use a counter to know whether the callbacks have finished or not
                    if(++counter === Object.keys(Ids).length) {
                        that.setState({dataRetrieved: true});
                    }
                })
            }
        });

        this.selectCourse = this.selectCourse.bind(this);
    }

    selectCourse(course) {
        this.setState({currentCourse: course});
    }

    render() {
        var that = this;
        var listItem = function(course) {
            return (
                <li className="course-item" key={course.id} >
                    <div id="courseLabel" onClick={() => {that.selectCourse(course);}}>
                        <div className="course-title">
                            <span className="course-number">{course.num}</span>
                            <span className="course-section">{course.section}</span>
                        </div>
                        <div className="course-prof">{course.professor}</div>
                        <div className="expand-button"></div>
                    </div>
                </li>
            )
        }

        return (
            <SplitPane split="vertical" minSize={50} defaultSize={200}>
                <div>
                    {this.instructorCourses.map(listItem)}
                </div>
                <div>
                    {typeof this.state.currentCourse != 'undefined' ?
                        <AppointInstructor course={this.state.currentCourse}/> :
                        <h1>Select a Course to start</h1>}
                </div>
            </SplitPane>
        )

        /*
         // Use react-tools
         return (
         <div>
         <Drawer active={this.state.active} onOverlayClick={this.handleToggle}>
         <h5>This is your Drawer.</h5>
         <p>You can embed any content you want, for example a Menu.</p>
         </Drawer>

         <AppBar title="Instructor Panel" leftIcon="menu">
         <Navigation type="horizontal">
         </Navigation>
         </AppBar>
         </div>
         );
         */
    }
}

export default InstructorPanel;