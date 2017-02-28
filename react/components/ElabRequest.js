import React from 'react';
import { database } from './../../database/database_init';
//import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

/**
ElabRequest - to be displayed on the side
*/
const NAME = 'elaboration_id_';
var num = 0;

class ElabRequest extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            id: NAME + num,
            answer: '',
            endorsed: false,
            resolved: false,
            a_username: '',
            dataRetrieved: false,
        };

        this.allRequests = undefined;
        this.requestID = undefined;

        var that = this;
        database.ref('/elab-request').once('value').then(function(snapshot) {
            that.allRequests = snapshot.val();
            that.requestID = Object.keys(snapshot.val());
            that.setState({dataRetrieved: true});
        });

        // Bind all functions so they can refer to "this" correctly
        //this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.updateIDFromDB = this.updateIDFromDB.bind(this);
    }
/*
    handleEdit(event) {
        this.setState({question: event.target.value});
    }
    */

    handleSubmit(event) {
        //var newPostKey = database.ref().child('elab-request').push().key;
        var updates = {};
        this.setState({
            id: 'elaboration_id_' + num
        });
        updates['/elab-request/' + this.state.id] = this.state.question;
        num++;
        database.ref().update(updates);
    }

    render () {

        var allRequests = this.allRequests;

        // render single elaboration item
        var requestList = function(elaboration) {
            var questions = allRequests[elaboration].question;
            var answers = allRequests[elaboration].answer;
            var parts = elaboration.split("_")
            var id = parts[parts.length-1]
            return (
                <p className="elaboration-item" key={elaboration}>
                    Question {id}:<br/>
                    <p1 className="elaboration-question">{questions}</p1><br/>
                    Answer {id}:<br/>
                    <p2 className="elaboration-answer">{answers}</p2><br/>
                </p>
            );
        };

        console.log("testing in Elab: " + this.props.testing);
        return (
            <div>
            <div style={{
                    textAlign: 'center',
                    margin: '0 auto',
                }}>
                <h2>All Questions & Answers</h2>
                {this.state.dataRetrieved ? this.requestID.map(requestList) : <p> Loading... </p> }
            </div>
            <div
                style={{
                    textAlign: 'center',
                    margin: '0 auto',
                    width: '560px',
                }} >
                <h2> Elaboration Request</h2>
                <form onSubmit={this.handleSubmit}>
	                <label>
	                Question:<textarea value={this.props.testing} onChange={this.props.handleEdit} />
	                </label>
	                <input type="submit" value="Submit" />
                </form>
            </div>
            </div>
        );
    }
}
//<Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateQuestionFromDB}><Glyphicon glyph="save" /> Update</Button>
export default ElabRequest;
