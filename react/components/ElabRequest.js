import React from 'react';
import { database } from './../../database/database_init';
import Question from './Question';
import CurrentQuestion from './CurrentQuestion';
import {connect} from 'react-redux';
//import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

/**
ElabRequest
*/
const NAME = 'elaboration_id_';
var user = 'Kiki';
var course = 'cse100-b-0';



class ElabRequest extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            answerDraft: '',
            author:'',
            a_username:'',
            endorsed:'',
            content: 'Please write your question here...',
            dataRetrieved: false,
        };

        // Used to store all elab info from database
        this.allRequests = undefined;
        // All elab ID under it
        this.requestID = undefined;
        // Grab the updated ID for content
        this.updatedID = 0;
        // Array to store answer
        this.answerArray = [];
        this.temp = [];

        // Grab initial data from database
        var that = this;
        database.ref('/elaborations/' + course).once('value').then(function(snapshot) {
            that.allRequests = snapshot.val();
            if(that.allRequests!=null){
                that.requestID = Object.keys(snapshot.val());
            }
            that.setState({dataRetrieved: true});
        });
        console.log('INITIALIZING');

        // Bind all functions so they can refer to "this" correctly
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.displayQuestion = this.displayQuestion.bind(this);
        this.editAnswer = this.editAnswer.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
    }

    // edit field for submitting ER
    handleEdit(event) {
        this.setState({content: event.target.value});
    }

    // edit answer for each ER
    editAnswer(event){
        this.setState({draft: event.target.value});
    }

    // updating ER to database
    handleSubmit() {
        var postData = {
            content:this.state.content,
            endorsed:this.state.endorsed,
            author:user,
        };
        var updates = {};
        this.updatedID = parseInt(this.updatedID)+1;
        updates['/elaborations/' + course + '/' + (NAME + this.updatedID)] = postData;
        database.ref().update(updates);
        window.location.reload();
    }

    // Update answer to database
    submitAnswer(inputtedID) {
        var that = this;
        var updates = {};
        console.log('inputtedID is :' + inputtedID);
        var newPostKey = database.ref('/elaborations/' + course + '/' + inputtedID + '/' + 'answers').push().key;
        var answerObj = {
            content: that.state.draft,
            a_username: user,
        };
        updates['/elaborations/' + course + '/' + inputtedID + '/answers/' + newPostKey] = answerObj;
        database.ref().update(updates);
        that.answerArray = that.answerArray.concat(that.state.draft);
        window.location.reload();
    }

    // remove answer of ID from database
    removeAnswer(inputtedID, index) {
        var that = this;
        console.log('index in removeAnswer is :' + index);
        console.log('inputtedID in removeAnswer is :' + inputtedID);
        console.log('Answer before removing inside removeAnswer: ' + that.answerArray);
        database.ref('/elaborations/' + course + '/' + inputtedID + '/answers/' + index).remove();
        window.location.reload();
    }

    removeQuestion(inputtedID){
        console.log('inputtedID in removeQuestion is :' + inputtedID);
        database.ref('/elaborations/' + course + '/' + inputtedID).remove();
        window.location.reload();
    }


    // Display ER to user
    displayQuestion(elaboration) {
        //console.log('elaboration is :' + elaboration);
        var allRequests = this.allRequests;
        //console.log('allRequests is :' + allRequests);
        var that = this;

        var questions = allRequests[elaboration].content;
        var question_owner = allRequests[elaboration].author;
        var answers = allRequests[elaboration].answers;
        var answer_owner = [];
        var keys = undefined;
        if(answers!=null&&answers!=undefined){
            console.log('answers is :' + JSON.stringify(answers));
            keys = Object.keys(answers);
        }
        var answers2 = [];
        if(answers!=null && answers != undefined){
            JSON.parse(JSON.stringify(answers), (key, value) => {
                if(key=='content'){
                    console.log(value);
                    answers2 = answers2.concat(value);
                }
                if(key=='a_username'){
                    console.log(value);
                    answer_owner = answer_owner.concat(value);
                }
            });
        }
        that.answerArray = answers2;
        console.log('answers2 is :' + answers2);
        console.log('answer_owner is :' + answer_owner);
        console.log('keys is :' + keys);
        //console.log('requestID is :' + this.requestID);
        //console.log('keys of answers: ' + Object.keys(answers));
        var parts = elaboration.split('_');
        console.log('PARTS ARE: ' + parts);
        that.updatedID = parts[parts.length-1];
        return(
            <div key={elaboration}>
              <CurrentQuestion elaboration={elaboration} question={questions}
              answers={answers2} answer_owner={answer_owner} parts={parts} keys={keys}
              removeAnswer={this.removeAnswer} submitAnswer={this.submitAnswer} editAnswer={this.editAnswer}/>
            </div>
        );
    }

    render() {
        //console.log('content in Elab: ' + this.state.content);
        //console.log('dataRetrieved in Elab: ' + this.state.dataRetrieved);
        console.log('allRequests in Elab: ' + this.allRequests);
        console.log('requestID in Elab: ' + this.requestID);
        return (
          <div>
              <div style={{
                  textAlign: 'center',
                  margin: '0 auto',
              }}>
              <h2>All Questions & Answers</h2>
              {this.state.dataRetrieved && this.requestID!=undefined ? this.requestID.map(this.displayQuestion) : <p> No Question & Answer Posted </p> }
              </div>
              <Question content={this.state.content} handleEdit={this.handleEdit} endorsed={this.state.endorsed}
              author={this.state.author} handleSubmit={this.handleSubmit} dataRetrieved={this.state.dataRetrieved}/>;
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
