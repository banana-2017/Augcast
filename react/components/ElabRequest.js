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
            // Used to store all elab info from database
            allRequests: undefined,
            // All elab ID under it
            requestID: undefined
        };
        this.updatedID = 0;

        console.log('INITIALIZING');

        // Bind all functions so they can refer to "this" correctly
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.displayQuestion = this.displayQuestion.bind(this);
        this.editAnswer = this.editAnswer.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
        this.firebaseQuery = this.firebaseQuery.bind(this);
    }

    // Grab initial data from database
    componentDidMount() {
        var that = this;
        database.ref('/elaborations/' + that.props.course + '/' + that.props.lecture).once('value').then(function(snapshot) {
            console.log('PATH: '+ '/elaborations/' + that.props.course + '/' + that.props.lecture);
            that.setState({allRequests: snapshot.val()});
            if(that.state.allRequests!=null){
                that.setState({requestID: Object.keys(snapshot.val())});
            }
            that.setState({dataRetrieved: true});
        });
    }

    //new props are in newProps
    // old props are in this.props
    // Do query using info in newProps
    componentWillReceiveProps(newProps) {
        this.setState({allRequests: undefined});
        this.setState({requestID: undefined});
        var that = this;
        database.ref('/elaborations/' + newProps.course + '/' + newProps.lecture).once('value').then(function(snapshot) {
            console.log('NEW PATH: '+ '/elaborations/' + that.props.course + '/' + that.props.lecture);
            that.setState({allRequests: snapshot.val()});
            if(that.state.allRequests!=null){
                that.setState({requestID: Object.keys(snapshot.val())});
            }
            that.setState({dataRetrieved: true});
        });
    }

    // edit field for submitting ER
    handleEdit(event) {
        this.setState({content: event.target.value});
    }

    // edit answer for each ER
    editAnswer(event){
        this.setState({draft: event.target.value});
    }

    // Firebase query once //
    firebaseQuery(id){
        var that = this;
        console.log('FB Query called by ' + id);
        database.ref('/elaborations/' + that.props.course + '/' + that.props.lecture).once('value').then(function(snapshot) {
            console.log('PATH: '+ '/elaborations/' + that.props.course + '/' + that.props.lecture);
            that.setState({allRequests: snapshot.val()});
            if(that.state.allRequests!=null){
                that.setState({requestID: Object.keys(snapshot.val())});
            }
            that.setState({dataRetrieved: true});
        });
    }

    // updating ER to database
    handleSubmit() {
        console.log('In HandleSubmit');
        this.setState({updatedID: 0});
        var postData = {
            content:this.state.content,
            endorsed:this.state.endorsed,
            author:this.props.username,
        };
        var updates = {};
        this.updatedID = parseInt(this.updatedID)+1;
        this.setState({updatedID: this.updatedID});
        updates['/elaborations/' + this.props.course + '/' + this.props.lecture + '/' + (NAME + this.updatedID)] = postData;
        database.ref().update(updates);
        //window.location.reload();

        // Firebase query once //
        this.firebaseQuery();
    }

    // Update answer to database
    submitAnswer(inputtedID) {
        var that = this;
        var updates = {};
        console.log('inputtedID is :' + inputtedID);
        var newPostKey = database.ref('/elaborations/' + this.props.course + '/' + this.props.lecture + '/' + inputtedID + '/' + 'answers').push().key;
        var answerObj = {
            content: that.state.draft,
            a_username: this.props.username,
        };
        updates['/elaborations/' + this.props.course + '/' + this.props.lecture + '/' + inputtedID + '/answers/' + newPostKey] = answerObj;
        database.ref().update(updates);
        //window.location.reload();

        // Firebase query once //
        this.firebaseQuery();
    }

    // remove answer of ID from database
    removeAnswer(inputtedID, index) {
        var that = this;
        console.log('index in removeAnswer is :' + index);
        console.log('inputtedID in removeAnswer is :' + inputtedID);
        console.log('Answer before removing inside removeAnswer: ' + that.answerArray);
        database.ref('/elaborations/' + that.props.course + '/' + this.props.lecture + '/' + inputtedID + '/answers/' + index).remove();
        //window.location.reload();

        // Firebase query once //
        this.firebaseQuery();
    }

    removeQuestion(inputtedID){
        var that = this;
        console.log('inputtedID in removeQuestion is :' + inputtedID);
        database.ref('/elaborations/' + that.props.course + '/' + that.props.lecture + '/' + inputtedID).remove();
        window.location.reload();
    }


    // Display ER to user
    displayQuestion(elaboration) {
        //console.log('elaboration is :' + elaboration);
        var allRequests = this.state.allRequests;
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
        console.log('answers array (answer2) is :' + answers2);
        console.log('answer_owner is :' + answer_owner);
        //console.log('keys is :' + keys);
        //console.log('requestID is :' + this.requestID);
        //console.log('keys of answers: ' + Object.keys(answers));
        var parts = elaboration.split('_');
        console.log('PARTS ARE: ' + parts);
        that.updatedID = parts[parts.length-1];
        return(
            <div key={elaboration}>
              <CurrentQuestion elaboration={elaboration} question={questions}
              answers={answers2} answer_owner={answer_owner} parts={parts} keys={keys}
              removeAnswer={this.removeAnswer} removeQuestion={this.removeQuestion} submitAnswer={this.submitAnswer} editAnswer={this.editAnswer} question_owner={question_owner} user={this.props.username} course={this.props.course} lecture={this.props.lecture}/>
            </div>
        );
    }

    render() {
        //console.log('content in Elab: ' + this.state.content);
        //console.log('dataRetrieved in Elab: ' + this.state.dataRetrieved);
        console.log('allRequests in Elab: ' + JSON.stringify(this.state.allRequests));
        console.log('requestID in Elab: ' + this.state.requestID);
        console.log('course in Elab : ' + this.props.course);
        console.log('lecture in Elab : ' + this.props.lecture);
        return (
          <div className="elab-container">
              <div style={{
                  textAlign: 'center',
                  margin: '0 auto',
              }}>
              <h2>All Questions & Answers</h2>
              {this.state.dataRetrieved && this.state.requestID!=undefined ? this.state.requestID.map(this.displayQuestion) : <p> No Question & Answer Posted </p> }
              </div>
              <Question content={this.state.content} handleEdit={this.handleEdit} endorsed={this.state.endorsed}
              author={this.state.author} handleSubmit={this.handleSubmit} dataRetrieved={this.state.dataRetrieved}/>;
          </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        username: state.username,
        currentCourse: state.currentCourse
    };
}

const ElabRequestContainer = connect(mapStateToProps)(ElabRequest);
export default ElabRequestContainer;
