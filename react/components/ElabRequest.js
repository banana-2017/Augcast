import React from 'react';
import { database } from './../../database/database_init';
import Question from './Question';
import Answer from './Answer';
import {connect} from 'react-redux';
//import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

/**
ElabRequest
*/
const NAME = 'elaboration_id_';

class ElabRequest extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            question:'Please write your question here...',
            endorsed:false,
            answerDraft: '',
            q_username:'',
            a_username:'',
            draft:'Please write your answer here...',
            dataRetrieved: false,
        };

        // Used to store all elab info from database
        this.allRequests = undefined;
        // All elab ID under it
        this.requestID = undefined;
        // Grab the updated ID for question
        this.updatedID = 0;
        // Array to store answer
        this.answerArray = [];
        this.temp = [];

        var that = this;
        database.ref('/elab-request').once('value').then(function(snapshot) {
            that.allRequests = snapshot.val();
            that.requestID = Object.keys(snapshot.val());
            that.setState({dataRetrieved: true});
        });
        console.log('INITIALIZING');

        // Bind all functions so they can refer to "this" correctly
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.displayQuestion = this.displayQuestion.bind(this);
        this.editAnswer = this.editAnswer.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.displayAnswer = this.displayAnswer.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
    }

    handleEdit(event) {
        this.setState({question: event.target.value});
    }

    editAnswer(event){
        this.setState({draft: event.target.value});
    }

    handleSubmit(event) {
        //var newPostKey = database.ref().child('elab-request').push().key;
        window.location.href = event.target.href;
        var postData = {
            question:this.state.question,
            endorsed:this.state.endorsed,
            //q_username:this.props.username,
            a_username:this.state.a_username,
        };
        var updates = {};
        this.updatedID = parseInt(this.updatedID)+1;
        updates['/elab-request/' + (NAME + this.updatedID)] = postData;
        database.ref().update(updates);
    }

    submitAnswer(inputtedID) {
        var that = this;
        console.log('inputtedID is :' + inputtedID);
        database.ref('/elab-request/' + inputtedID + '/' + 'answer').push(that.state.draft);
        that.answerArray = that.answerArray.concat(that.state.draft);
    }

    removeAnswer(inputtedID, index) {
        var that = this;
        console.log('index in removeAnswer is :' + index);
        console.log('inputtedID in removeAnswer is :' + inputtedID);
        console.log('Answer before removing inside removeAnswer: ' + that.answerArray);
        database.ref('/elab-request/' + inputtedID + '/answer/' + index).remove();
    }

    displayAnswer(rawIndex,inputtedID, answerText, filler){
        console.log('answerText: ' + answerText);
        console.log('index: ' + rawIndex);
        console.log('inputtedID: ' + inputtedID);
        //this.setState({answer: this.state.answer.concat(answerText)});
        var index = rawIndex[filler];
        var buttonStyle = {backgroundColor: '#efb430', width: '60px', height: '20px', textAlign: 'center',
            margin: '10px 10px 5px 3px', boxShadow: '3px 3px 5px rgba(60, 60, 60, 0.4)', color: '#fff',
            fontWeight: '300', fontSize: '14px', display: 'inline-block'};
        var that = this;
        return(
            <div className="elaboration-oneAnswer" key={index}>
                 <li className="elaboration-oneAnswer-text">{answerText}</li>
                 <form>
                   <a style={buttonStyle} onClick={() => {that.removeAnswer(inputtedID, index);}}>
                     Delete
                   </a>
                 </form>
             </div>
        );
    }

    displayQuestion(elaboration) {
        //console.log('elaboration is :' + elaboration);
        var allRequests = this.allRequests;
        //console.log('allRequests is :' + allRequests);
        var that = this;

        var questions = allRequests[elaboration].question;
        var answers = allRequests[elaboration].answer;
        var keys = [];
        console.log('answers is :' + JSON.stringify(answers));
        var answers2 = [];
        if(answers!=null || answers != undefined){
            JSON.parse(JSON.stringify(answers), (key, value) => {
                console.log(value);
                if(typeof value === 'string'){
                    answers2 = answers2.concat(value);
                    keys = keys.concat(key);
                }
            });
        }
        that.answerArray = answers2;
        console.log('answers2 is :' + answers2);
        console.log('keys is :' + keys);
        //console.log('requestID is :' + this.requestID);
        //console.log('keys of answers: ' + Object.keys(answers));
        var parts = elaboration.split('_');
        console.log('PARTS ARE: ' + parts);
        that.updatedID = parts[parts.length-1];
        var buttonStyle = {backgroundColor: '#efb430', width: '150px', height: '40px', textAlign: 'center',
            margin: '10px 10px 5px 3px', boxShadow: '3px 3px 5px rgba(60, 60, 60, 0.4)', color: '#fff',
            fontWeight: '300', fontSize: '22px', display: 'inline-block'};
        return(
            <div key={elaboration}>
              <div className="elaboration-question">
                <p className="elaboration-question-text" key={parts}>
                Question {that.updatedID}:<br/>
                <p1 style={{backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid', width: '800px', fontSize: '20px'}} className="elaboration-question">{questions}</p1><br/>
                </p>
              </div>
              <div className="elaboration-answer">
                {answers != null && answers2.map(that.displayAnswer.bind(this,keys,elaboration))}
                <form>
                    <input
                        style={{margin: '5px 5px 5px 5px', width: '780px', height: '100px'}}
                        type="text"
                        className="form-control"
                        defaultValue= {that.state.draft}
                        onChange={that.editAnswer}/>
                    <div>
                        <a style={buttonStyle} onClick={() => {that.submitAnswer(elaboration);}}>
                            Submit
                        </a>
                    </div>
                </form>
              </div>
            </div>
        );
    }


    render() {
        //console.log('question in Elab: ' + this.state.question);
        //console.log('dataRetrieved in Elab: ' + this.state.dataRetrieved);
        console.log('allRequests in Elab: ' + this.allRequests);
        return (
          <div>
          <div style={{
              textAlign: 'center',
              margin: '0 auto',
          }}>
          <h2>All Questions & Answers</h2>
          {this.state.dataRetrieved && this.requestID!=undefined ? this.requestID.map(this.displayQuestion) : <p> No Question & Answer Posted </p> }
          </div>
          <Question question={this.state.question} handleEdit={this.handleEdit} endorsed={this.state.endorsed}
          q_username={this.state.q_username} handleSubmit={this.handleSubmit} dataRetrieved={this.state.dataRetrieved}/>;
          <Answer handleEdit={this.handleEdit} id={this.id} allRequests={this.allRequests}
          requestID={this.requestID} a_username={this.state.a_username} handleSubmit={this.handleSubmit} dataRetrieved={this.state.dataRetrieved}/>;
          </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        username: state.username
    };
}

const ElabRequestContainer = connect(mapStateToProps)(ElabRequest);
export default ElabRequestContainer;
