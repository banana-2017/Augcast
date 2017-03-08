import React from 'react';
import { database } from './../../database/database_init';

class AppointInstructor extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            dataRetrieved: false
        }

        // Instance Variable
        this.testCourseId = "cse100";
        this.usersObj = undefined;
        this.studentsArray = [];
        this.instructorsArray = [];

        // query the users directory
        var that = this;
        database.ref('users').once('value').then(function(snapshot) {
            that.usersObj = snapshot.val();

            for(var user in that.usersObj) {
                // push every user object into student array
                let current = that.usersObj[user];
                that.studentsArray.push(current);

                // Check whether the user is instructor for this class
                // and if it is, push it into the instructor array
                let instructorCourse = current.instructorFor;
                if(typeof instructorCourse != 'undefined') {
                    for(var course in instructorCourse) {
                        if(instructorCourse[course] === that.testCourseId) {
                            that.instructorsArray.push(current);
                            break;
                        }
                    }
                }
            }

            // check if it works
            console.log("instructorsArray", that.instructorsArray);
            console.log("studentsArray", that.studentsArray);

            that.setState({dataRetrieved: true});
        })


        // Bind the function
        this.selectInstructor = this.selectInstructor.bind(this);
    }

    selectInstructor(testCourseId) {
        var that = this;

        let testUserId = "instructor";

        let instructorCourses = undefined;
        // query the instructorFor array field of the selected users
        var ref = database.ref('/users/' + testUserId + '/instructorFor');
        ref.once('value').then(function(snapshot) {
            instructorCourses = snapshot.val();

            console.log(instructorCourses);
            var updates = {};
            updates[Object.keys(instructorCourses).length] = testCourseId;
            ref.update(updates);
        })
    }

    // showInstructors() {
    //     var instructorItem = function(instructor) {
    //         let name = instructor.username;
    //         let email = instructor.email;
    //         return(
    //             <li className="instructor" key="{instructor}">
    //                 <span style={{color: "green"}}>{name} </span>
    //                 <span style={{color: "blue"}}>{email}</span>
    //             </li>
    //         )
    //     }
    //
    //     return(
    //         <div className="instructors">
    //             <ul className="instructor-list">
    //                 {this.state.dataRetrieved ?
    //                     this.instructorsArray.map(instructorItem) : <p>Loading</p>}
    //             </ul>
    //         </div>
    //     )
    //  }

    render () {
        var instructorItem = function(instructor) {
            let name = instructor.username;
            let email = instructor.email;
            return(
                <tr>
                <td>{name}</td>
                <td>{email}</td>
                <td>XXX</td>
                </tr>
            )
        }

        return (
            <div className="instructors">
                <table id='instructor-table'>
                    <tr class="header">
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                    {this.state.dataRetrieved ?
                        this.instructorsArray.map(instructorItem) : <p>Loading</p>}
                </table>
            </div>
            )

    }
}

export default AppointInstructor;
