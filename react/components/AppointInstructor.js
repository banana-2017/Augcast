import React from 'react';
import { database } from './../../database/database_init';

import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';

class AppointInstructor extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            studentsArray: [],
            instructorsArray: [],
            instructor: {username: 0},

            dialogActive: false,
        };

        // first time query database
        this.update();

        // Bind the function
        this.update = this.update.bind(this);
        this.addInstructor = this.addInstructor.bind(this);
        this.removeInstructor = this.removeInstructor.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(this.props.course) != JSON.stringify(nextProps.course)) {
            this.update();
        }
    }

    update() {
        let students_temp = [];
        let instructors_temp = [];

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
                        instructors_temp.push(user);
                    }
                }
                else {
                    students_temp.push(user);
                }
            }

            that.setState({studentsArray: students_temp, instructorsArray: instructors_temp});
        })
    }

    addInstructor(chosenUser) {
        var that = this;

        // query the instructorFor array field of the selected users
        var ref = database.ref('/users/' + chosenUser.text + '/instructorFor');
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

    render () {
        var that = this;

        let handleDialogHiding = () => {
            that.setState({dialogActive: false, student: {username: 0}});
        }

        let handleAdd = (chosenRequest) => {
            that.addInstructor(chosenRequest);
        }

        let handleRemove = () => {
            that.removeInstructor(that.state.instructor);
            that.setState({dialogActive: !that.state.dialogActive});
        }

        // Render the instructor item in the list under the search bar
        let instructorItem = function(instructor) {
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
        };

        // Render the student item in the search bar
        let studentItem = function(student) {
            let searchItem = {
                text: student.username,
                value: (
                    <MenuItem
                        primaryText={student.username}
                        secondaryText={student.email}
                    />
                ),
            }

            return (searchItem);
        };

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={handleDialogHiding}
            />,
            <FlatButton
                label="Yes"
                primary={true}
                onTouchTap={handleRemove}
            />,
        ];

        return (
            <div>
                <AutoComplete
                    floatingLabelText="Search for New Instructor"
                    filter={AutoComplete.fuzzyFilter}
                    onNewRequest={handleAdd}
                    dataSource={this.state.studentsArray.map(studentItem)}
                />

                <List>
                    <ListSubHeader caption="Instructors"/>
                    {this.state.instructorsArray.map(instructorItem)}
                </List>

                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.dialogActive}
                    onRequestClose={handleDialogHiding}
                >
                    {"Are you sure you want to remove instructor " + this.state.instructor.username}
                </Dialog>

            </div>
        );
    }
}

export default AppointInstructor;
