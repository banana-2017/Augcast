import React from 'react';
import { database } from './../../database/database_init';
import { Button } from 'react-bootstrap';
import Fuse from "fuse.js";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class AppointInstructor extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            students: [],
            instructors: [],
            searchResult: []
        };

        // Indicate the props that this class should have
        console.log(this.props.course);

        // first time query database
        this.updateArray();

        // Bind the function
        this.addInstructor = this.addInstructor.bind(this);
        this.updateArray = this.updateArray.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.searchInput = this.searchInput.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(this.props.course) != JSON.stringify(nextProps)) {
            this.updateArray();
        }
    }

    updateArray(){
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
                    instructorsArray.push(user);
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
                    console.log("duplicate");
                }
                else {
                    let updates = {};
                    updates[Object.keys(instructorCourses).length] = that.props.course.id;
                    ref.update(updates);
                }
            }

            that.updateArray();
        });
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

        // Set the search result to be the state so that the component will refresh when the data changes
        this.setState({searchResult: searchResults});
    }

    render () {
        var that = this;
        const optionsProp_student = {
            onRowClick: function(row) {
                that.addInstructor(row);
            },

            noDataText: "No Student Found"
        }

        const selectRowProp_student = {
            mode: 'checkbox',
            bgColor: '#ccccff',
            hideSelectColumn: true,
            clickToSelect: true

        };
        return (
            <div>
                <big> Instructor List </big>
                <BootstrapTable data={this.state.instructors} bordered={false} options={ { noDataText: "No instructor found"} }>
                    <TableHeaderColumn dataField="username" isKey>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="email">email</TableHeaderColumn>
                </BootstrapTable>

                <input type="text"
                       placeholder="Appoint Instructors"
                       onChange={this.searchInput}/>

                <BootstrapTable data={this.state.searchResult} bordered={false}
                                options={optionsProp_student} selectRow={selectRowProp_student}>
                    <TableHeaderColumn dataField="username" isKey>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="email">email</TableHeaderColumn>
                </BootstrapTable>

            </div>
        );
    }
}

export default AppointInstructor;
