import React from 'react';
import { database } from './../../database/database_init';
import Question from './Question'
import Answer from './Answer'
//import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

/**
ElabRequest 
*/
const NAME = 'elaboration_id_';
var num = 1;

class ElabRequest extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            id: NAME + num,
            question:'Please write your question here...',
            answer: [],
            endorsed:false,
            q_username:'',
            a_username:'',
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
        this.setState({
            id: 'elaboration_id_' + num
        });
        updates['/elab-request/' + this.state.id] = this.state;
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
                    <p2 className="elaboration-answer">{answers.map((k, index) => <li key={index}>{ `${k}` }</li>) }</p2><br/>
                </p>
            );
        };

        console.log("question in Elab: " + this.state.question);
        console.log("question in Elab: " + this.state.id);
        return (
            <div>
            <div style={{
                    textAlign: 'center',
                    margin: '0 auto',
                }}>
                <h2>All Questions & Answers</h2>
                {this.state.dataRetrieved ? this.requestID.map(requestList) : <p> Loading... </p> }
            </div>
            <Question question={this.state.question} handleEdit={this.handleEdit} endorsed={this.state.endorsed} 
            q_username={this.state.q_username} handleSubmit={this.handleSubmit} dataRetrieved={this.state.dataRetrieved}/>;
            <Answer answer={this.state.answer} handleEdit={this.handleEdit} 
            a_username={this.state.a_username} handleSubmit={this.handleSubmit} dataRetrieved={this.state.dataRetrieved}/>;
            </div>
        );
    }
}
//<Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateQuestionFromDB}><Glyphicon glyph="save" /> Update</Button>
export default ElabRequest;
