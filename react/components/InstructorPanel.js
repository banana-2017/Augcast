import React from 'react';
import { database } from './../../database/database_init'
import AppointInstructor from './AppointInstructor';

class InstructorPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            course: undefined,
            dataRetrieved: false
        }

        var that = this;
        database.ref('courses/cse100-a').once('value').then(function(snapshot) {
            that.setState({course: snapshot.val(), dataRetrieved: true});
            console.log("current course", that.state.course);
        })
    }

    render () {
        return (
            this.state.dataRetrieved ? <AppointInstructor course={this.state.course}/> : <p> loading </p>
        )
    }
}

export default InstructorPanel;