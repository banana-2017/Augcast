import React from 'react';
import { database } from './../../database/database_init';
import { Button } from 'react-bootstrap';
import Fuse from "fuse.js";

class AppointInstructor extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            dataRetrieved: false,
            searchResult: []
        };

        // Instance Variable
        this.courseId = this.props.course.id;
        this.studentsArray = [];
        this.instructorsArray = [];

        console.log(this.courseId);

        // query the users directory
        var that = this;
        database.ref('users').once('value').then(function(snapshot) {
            let usersDirObj = snapshot.val();

            for(var user in usersDirObj) {
                // push every user object into student array
                let current = usersDirObj[user];
                that.studentsArray.push(current);

                // Check whether the user is instructor for this class
                // and if it is, push it into the instructor array
                let instructorCourse = current.instructorFor;
                if(typeof instructorCourse != 'undefined') {
                    for(var course in instructorCourse) {
                        if(instructorCourse[course] === that.courseId) {
                            that.instructorsArray.push(current);
                            break;
                        }
                    }
                }
            }

            that.setState({dataRetrieved: true});
        })


        // Bind the function
        this.addInstructor = this.addInstructor.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.searchInput = this.searchInput.bind(this);
    }

    /*
     * Update the database when a user is selected to be the instructor
     *
     * userId: the id of the user to be the instructor
     */
    addInstructor(userId) {
        var that = this;

        let instructorCourses = undefined;
        // query the instructorFor array field of the selected users
        var ref = database.ref('/users/' + userId + '/instructorFor');
        ref.once('value').then(function(snapshot) {
            instructorCourses = snapshot.val();

            var updates = {};
            updates[Object.keys(instructorCourses).length] = that.courseId;
            ref.update(updates);
        })
    }

    /*
     * The function handling searching the users using fuzzy search
     *
     * query: string to be searched for
     */
    searchUser(query) {
        let options = {
            include: ["score"],
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
                "email",
                "username"
            ]
        };

        // fuse = {item: "user object", score: "0 means perfect match"}
        let fuse = new Fuse(this.studentsArray, options);
        return fuse.search(query);
    }

    /*
     * This function handling searching user input by calling searchUser
     */
    searchInput (e) {
        let query = e.target.value;

        // get the raw data from fuzzy search
        let result = this.searchUser(query);

        // extract user object from the raw search result array
        let searchResults = [];
        for(let index in result) {
            if(result[index].score < 0.3) {
                searchResults.push(result[index].item);
            }
        }

        // Set the search result to be the state so that the component will refresh when the data changes
        this.setState({searchResult: searchResults});
    }

    render () {
        var that = this;
        var userItem = function(user) {
            let name = user.username;
            let email = user.email;
            return(
                <tr key={email}>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>
                        <Button bsStyle="default" onClick={that.addInstructor(email.split('@')[0])}>+</Button>
                    </td>
                </tr>
            )
        };
        return (
            <div className="instructors">
                <h3>Instructor List </h3>
                <input type="text"
                       placeholder="Appoint Instructors"
                       onChange={this.searchInput}/>
                <table id='instructor-table'>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.dataRetrieved ?
                        this.instructorsArray.map(userItem) : <tr><td>Loading</td></tr>}
                    </tbody>
                </table>

                <h3>Student List </h3>
                <table id='student-table'>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.dataRetrieved ?
                        this.state.searchResult.map(userItem) : <tr><td>Loading</td></tr>}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default AppointInstructor;
