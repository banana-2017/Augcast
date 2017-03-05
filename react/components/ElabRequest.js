import React from 'react';
import { database } from './../../database/database_init';
import Question from './Question'
import Answer from './Answer'
//import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

/**
ElabRequest
*/
const NAME = 'elaboration_id_';
var newestID = 0;

class ElabRequest extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            question:'Please write your question here...',
            answer: [''],
            endorsed:false,
            q_username:'',
            a_username:'',
            dataRetrieved: false,
        };

        this.allRequests = undefined;
        this.requestID = undefined;
        this.updatedID = undefined;

        var that = this;
        database.ref('/elab-request').once('value').then(function(snapshot) {
            that.allRequests = snapshot.val();
            that.requestID = Object.keys(snapshot.val());
            that.setState({dataRetrieved: true});
        });

        // Bind all functions so they can refer to "this" correctly
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.updateIDFromDB = this.updateIDFromDB.bind(this);
    }

    handleEdit(event) {
        this.setState({question: event.target.value});
    }

    handleSubmit(event) {
        //var newPostKey = database.ref().child('elab-request').push().key;
        var updates = {};
        this.updatedID = parseInt(this.updatedID)+1
        updates['/elab-request/' + (NAME + this.updatedID)] = this.state;
        database.ref().update(updates);
    }

    remove(event) {
        //var newPostKey = database.ref().child('elab-request').push().key;
        var updates = {};
        updates['/elab-request/'] = this.state;
        database.ref().update(updates);
    }

    render () {
        return (
            <div>
            <Question question={this.state.question} handleEdit={this.handleEdit} endorsed={this.state.endorsed}
            q_username={this.state.q_username} handleSubmit={this.handleSubmit} dataRetrieved={this.state.dataRetrieved}/>;
            <Answer answer={this.state.answer} handleEdit={this.handleEdit} id={this.id} allRequests={this.allRequests}
              requestID={this.requestID} a_username={this.state.a_username} handleSubmit={this.handleSubmit} dataRetrieved={this.state.dataRetrieved}/>;
            </div>
        );
    }
}
//<Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateQuestionFromDB}><Glyphicon glyph="save" /> Update</Button>
export default ElabRequest;
