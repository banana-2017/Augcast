import React from 'react';
import { database } from './../../database/database_init';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

/**
ElabRequest - to be displayed on the side
*/
const NAME = 'elaboration_id_'
var num = 0
class ElabRequest extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
        	id: NAME + num,
            question: 'Please write your question here...',
            answer: '',
            endorsed: false,
            resolved: true,
            q_userName: '',
            a_username: '',
            testing: '',
        };

        // Bind all functions so they can refer to "this" correctly
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateQuestionFromDB = this.updateQuestionFromDB.bind(this);

    }

    handleEdit(event) {
        this.setState({question: event.target.value});
    }

    handleSubmit(event) {
        alert('The question has been submitted: ');
        event.preventDefault();
        var newPostKey = database.ref().child('elab-request').push().key;
        var updates = {};
        updates['/elab-request/' + this.state.id] = this.state.question;
        updates['/elab-request/' + this.state.id] = this.state.answer;
        updates['/elab-request/' + this.state.id] = this.state.endorsed;
        updates['/elab-request/' + this.state.id] = this.state.resolved;
        updates['/elab-request/' + this.state.id] = this.state.q_userName;
        updates['/elab-request/' + this.state.id] = this.state.a_userName;
        this.setState({
                id: 'elaboration_id_' + (++num)
        });
        database.ref().update(updates);
    }

    updateQuestionFromDB() {
        var that = this;    // Maintain current "this" in Firebase callback

        // Fetch value from db and set currentTime
        database.ref('/elab-request/' + that.state.id).once('value').then(function(snapshot) {
            that.setState({
                testing: 'fetched question from db: ' + snapshot.val()
            });
        });
    }

    render () {
        return (
            <div
                style={{
                    textAlign: 'center',
                    margin: '0 auto',
                    width: '560px',
                }} >
                <h2> Elaboration Request</h2>
                <form onSubmit={this.handleSubmit}>
	                <label>
	                Question:<textarea value={this.state.question} onChange={this.handleEdit} />
	                </label>
	                <input type="submit" value="Submit" />
                </form>
                Grab data from database:
                <Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateQuestionFromDB}><Glyphicon glyph="save" /> Update</Button>
            </div>
        );
    }
}

export default ElabRequest;
