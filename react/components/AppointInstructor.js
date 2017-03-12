import React from 'react';
import { database } from './../../database/database_init';
import { FormControl } from 'react-bootstrap';
import Fuse from "fuse.js";

import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import Snackbar from 'react-toolbox/lib/snackbar';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';


class AppointInstructor extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            students: [],
            instructors: [],
            searchResult: [],
            instructor: {username: 0},
            student: {username: 0},

            dialogActive: false,
            snackbarActive: false


        };

        // Indicate the props that this class should have
        console.log("Props to AppointInstructor: ");
        console.log("Course: ", this.props.course);
        console.log("Course: ", this.props.username);
        console.log("--------------------")

        // first time query database
        this.update();

        // Bind the function
        this.addInstructor = this.addInstructor.bind(this);
        this.update = this.update.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.searchInput = this.searchInput.bind(this);
        this.removeInstructor = this.removeInstructor.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(this.props.course) != JSON.stringify(nextProps.course)) {
            this.update();
        }
    }

    update() {
        let studentsArray = [];
        let instructorsArray = [];

        // query the users directory
        var that = this;
        database.ref('users').once('value').then(function(snapshot) {
            let usersDirObj = snapshot.val();

            for(let index in usersDirObj) {
                let user = usersDirObj[index];

                // Check whether the user is instructor for this class
                // if it is, push it into the instructor array
                // otherwise, push it into the student array
                let instructorCourse = user.instructorFor;
                if (typeof instructorCourse != 'undefined' &&
                    Object.values(instructorCourse).includes(that.props.course.id)) {
                    if(user.username != that.props.username) {
                        instructorsArray.push(user);
                    }
                }
                else {
                    studentsArray.push(user);
                }
            }

            that.setState({students: studentsArray, instructors: instructorsArray});
        })
    }

    addInstructor(user) {
        var that = this;

        // query the instructorFor array field of the selected users
        var ref = database.ref('/users/' + user.username + '/instructorFor');
        ref.once('value').then(function(snapshot) {
            let instructorCourses = snapshot.val();

            if(instructorCourses == null) {
                let updates = {};
                updates[0] = that.props.course.id;
                ref.update(updates);
            }
            else {
                if (Object.values(instructorCourses).includes(that.props.course.id)) {
                    alert("duplicate");
                }
                else {
                    let updates = {};
                    updates[Object.keys(instructorCourses).length] = that.props.course.id;
                    ref.update(updates);
                }
            }

            that.setState({searchResult: []});
            that.update();
        });
    }

    removeInstructor(user) {
        var that = this;

        var ref = database.ref('/users/' + user.username + '/instructorFor');
        ref.once('value').then(function(snapshot) {
            let courses = snapshot.val();

            var updates = {};
            for(let index in courses) {
                if(courses[index] === that.props.course.id) {
                    updates[index] = null
                }
            }

            ref.update(updates);
            that.update();
        })
    }

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
        let fuse = new Fuse(this.state.students, options);
        return fuse.search(query);
    }

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

        console.log(searchResults);
        // Set the search result to be the state so that the component will refresh when the data changes
        this.setState({searchResult: searchResults});
    }

    render () {
        var that = this;

        let handleSnackHiding = () => {
            that.setState({snackbarActive: false});
        }

        let handleDialogHiding = () => {
            that.setState({dialogActive: false});
        }

        let handleRemove = () => {
            that.removeInstructor(that.state.instructor);
            that.setState({dialogActive: !that.state.dialogActive});
        }


        var studentItem = function(student) {
            return (
                <div key={student.username}>
                    <ListItem
                        leftIcon="face"
                        caption={student.username}
                        legend={student.email}
                        selectable={true}
                        onClick={()=>{
                            that.setState({snackbarActive: true, student: student});
                            that.addInstructor(student);
                        }}
                        rightIcon="person_add"/>

                </div>
            )
        }

        var instructorItem = function(instructor) {
            return (
                <div key={instructor.username}>
                    <ListItem
                        leftIcon="person"
                        caption={instructor.username}
                        selectable={true}
                        onClick={()=>{
                            that.setState({dialogActive: true, instructor: instructor});
                        }}
                        legend={instructor.email}/>

                </div>

            )
        }

        return (

            <div>
                <FormControl type="text"
                             placeholder="Search Users"
                             onChange={this.searchInput}
                             />
                <List>
                    <ListSubHeader caption="Instructors"/>
                    {this.state.instructors.map(instructorItem)}

                </List>
                <List>
                    <ListSubHeader caption="Students"/>
                    {this.state.searchResult.map(studentItem)}

                </List>

                <Dialog
                    actions={[
                        { label: "No", onClick: handleDialogHiding },
                        { label: "Yes", onClick: handleRemove }
                    ]}
                    active={that.state.dialogActive}
                    onEscKeyDown={handleDialogHiding}
                    onOverlayClick={handleDialogHiding}
                    title="Are you sure?">

                    <p>Are you sure you want to remove {that.state.instructor.username}</p>
                </Dialog>

                <Snackbar
                    action='Dismiss'
                    active={that.state.snackbarActive}
                    label={"You have added " + that.state.student.username + " to instructor."}
                    timeout={10000}
                    onClick={handleSnackHiding}
                    onTimeout={handleSnackHiding}
                    type='cancel'
                    />

            </div>

        )
    }
}

export default AppointInstructor;
