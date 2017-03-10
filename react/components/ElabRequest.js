import React from 'react';
import { database } from './../../database/database_init';
import Question from './Question';
import {connect} from 'react-redux';
//import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

/**
ElabRequest
*/
const NAME = 'elaboration_id_';
var user = 'alan';

class ElabRequest extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            content:'Please write your question here...',
            endorsed:false,
            answerDraft: '',
            author:'',
            a_username:'',
            draft:'Please write your answer here...',
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
        this.startEditing = this.startEditing.bind(this);
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
    handleSubmit(event) {
        //var newPostKey = database.ref().child('elab-request').push().key;
        window.location.href = event.target.href;
        var postData = {
            content:this.state.content,
            endorsed:this.state.endorsed,
            author:user,
        };
        var updates = {};
        this.updatedID = parseInt(this.updatedID)+1;
        updates['/elab-request/' + (NAME + this.updatedID)] = postData;
        database.ref().update(updates);
    }

    startEditing() {
        console.log('IN START EDITING');
        var containerStyle = {backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid',
            width: '800px', fontSize: '25px'};
        var buttonStyle = {backgroundColor: '#efb430', width: '150px', height: '40px', textAlign: 'center',
            margin: '10px 10px 5px 3px', boxShadow: '3px 3px 5px rgba(60, 60, 60, 0.4)', color: '#fff',
            fontWeight: '300', fontSize: '22px', display: 'inline-block'};

        return(
            <div className="request-new" style={containerStyle}>
              <form>
                  <input
                      style={{margin: '5px 5px 5px 5px', width: '780px', height: '100px'}}
                      type="text"
                      className="form-control"
                      defaultValue= {this.content}
                      onChange={this.handleEdit}/>
                  <div className="request-buttons">
                      <a style={buttonStyle} onClick={this.handleSubmit}>
                          Submit
                      </a>
                  </div>
              </form>
          </div>
        );
    }

    // Update answer to database
    submitAnswer(inputtedID) {
        var that = this;
        var updates = {};
        console.log('inputtedID is :' + inputtedID);
        var newPostKey = database.ref('/elab-request/' + inputtedID + '/' + 'answers').push().key;
        var answerObj = {
            content: that.state.draft,
            a_username: user,
        };
        updates['/elab-request/' + inputtedID + '/answers/' + newPostKey] = answerObj;
        database.ref().update(updates);
        that.answerArray = that.answerArray.concat(that.state.draft);
    }

    // remove answer of ID from database
    removeAnswer(inputtedID, index) {
        var that = this;
        console.log('index in removeAnswer is :' + index);
        console.log('inputtedID in removeAnswer is :' + inputtedID);
        console.log('Answer before removing inside removeAnswer: ' + that.answerArray);
        database.ref('/elab-request/' + inputtedID + '/answers/' + index).remove();
    }

    // display answer list of each ER to user
    displayAnswer(rawIndex,inputtedID, answer_owner, answerText,filler){
        console.log('answer_owner: ' + answer_owner);
        console.log('rawIndex: ' + rawIndex);
        console.log('inputtedID: ' + inputtedID);
        console.log('filler: ' + filler);
        var owner = answer_owner[filler];
        console.log('owner: ' + owner);
        //this.setState({answer: this.state.answer.concat(answer_owner)});
        var index = rawIndex[filler];
        var buttonStyle = {backgroundColor: '#efb430', width: '60px', height: '20px', textAlign: 'center',
            margin: '10px 10px 5px 3px', boxShadow: '3px 3px 5px rgba(60, 60, 60, 0.4)', color: '#fff',
            fontWeight: '300', fontSize: '14px', display: 'inline-block'};
        var that = this;
        return(
            <div className="elaboration-oneAnswer" key={index}>
                 <li className="elaboration-oneAnswer-text">{answerText} ----- Posted By {owner}</li>
                 <form>
                   {owner==user&&
                   <a style={buttonStyle} onClick={() => {that.removeAnswer(inputtedID, index);}}>
                     Delete
                   </a>}
                 </form>
             </div>
        );
    }

    // Display ER to user
    displayQuestion(elaboration) {
        //console.log('elaboration is :' + elaboration);
        var allRequests = this.allRequests;
        //console.log('allRequests is :' + allRequests);
        var that = this;

        var contents = allRequests[elaboration].content;
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
        var buttonStyle = {backgroundColor: '#efb430', width: '150px', height: '40px', textAlign: 'center',
            margin: '10px 10px 5px 3px', boxShadow: '3px 3px 5px rgba(60, 60, 60, 0.4)', color: '#fff',
            fontWeight: '300', fontSize: '22px', display: 'inline-block'};

        return(
            <div key={elaboration}>
              <div className="elaboration-content">
                <p className="elaboration-content-text" key={parts}>
                Question {that.updatedID}:<br/>
                <p1 style={{backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid', width: '800px', fontSize: '20px'}} className="elaboration-content">{contents} Posted by ---- {question_owner}</p1><br/>
                </p>
              </div>
              <div className="elaboration-answer">
                {answers != null && answers2.map(that.displayAnswer.bind(this,keys,elaboration, answer_owner))}
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
        //console.log('content in Elab: ' + this.state.content);
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
