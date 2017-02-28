import React from 'react';
import { database } from './../../database/database_init';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

/**
ElabRequest - to be displayed on the side
*/
const NAME = 'elaboration_id_'
class Question extends React.Component {
    constructor(props) {
        super(props);
        // Initial state
        this.state = {
            testing: "for testing",
            question: 'Please write your question here...',
            endorsed: false,
            resolved: false,
            q_userName: '',
            dataRetrieved: false,
        };

        // Bind all functions so they can refer to "this" correctly
        this.handleEdit = this.handleEdit.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEdit(event) {
        this.setState({question: event.target.value});
    }
/*
    handleSubmit(event) {
        //alert('The question has been submitted: ');
        var newPostKey = database.ref().child('elab-request').push().key;
        var updates = {};
        this.setState({
                id: 'elaboration_id_' + num
        });
        updates['/elab-request/' + this.state.id] = this.state
        num++
        database.ref().update(updates);
    }
*/
    render: function() {
        console.log("testing in question: " + testing);
        return <ElabRequest question={this.state.question} handleEdit={this.handleEdit} testing={this.state.testing}/>;
    }
}
//<Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateQuestionFromDB}><Glyphicon glyph="save" /> Update</Button>
export default ElabRequest;
