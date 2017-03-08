import React from 'react';
import { database } from './../../database/database_init';
import Question from './Question';
import Answer from './Answer';
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
            answer: [],
            endorsed:false,
            answerDraft: '',
            q_username:'',
            a_username:'',
            draft:'Please write your answer here...',
            dataRetrieved: false,
            retrieveAnswer: false,
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
        var updates = {};
        this.updatedID = parseInt(this.updatedID)+1;
        updates['/elab-request/' + (NAME + this.updatedID)] = this.state;
        database.ref().update(updates);
    }

    submitAnswer(inputtedID) {
        var that = this;
        console.log('inputtedID is :' + inputtedID);
        console.log('answer after inputtedID is :' + that.state.answer);
        database.ref('/elab-request/' + inputtedID + '/answer').once('value').then(function(snapshot) {
            that.setState({answer: that.state.answer.concat(snapshot.val())});
            console.log('SNAPSHOT in database is :' + snapshot.val());
            console.log('answer in database is :' + that.state.answer);
            that.setState({retrieveAnswer: true});
            console.log('retrieveAnswer value: ' + that.state.retrieveAnswer);
            if(that.state.retrieveAnswer){
                var updates = {};
                console.log('INSIDE IF');
                that.setState({answer: that.state.answer.concat(that.state.draft)});
                updates['/elab-request/' + inputtedID + '/' + 'answer'] = that.state.answer;
                database.ref().update(updates);
            }
        });
    }

    removeAnswer(inputtedID, index) {
        var that = this;
        //console.log('inputtedID is :' + inputtedID);
        //console.log('answer after inputtedID is :' + that.state.answer);
        database.ref('/elab-request/' + inputtedID + '/answer/' + index).once('value').then(function(snapshot) {
            console.log('SNAPSHOT in database is :' + snapshot.val());
            var updates = {};
            that.setState({answer: that.state.answer.filter((_, i) => i !== index)});
            updates['/elab-request/' + inputtedID  + '/answer/' + index] = null;
            database.ref().update(updates);
        });
    }

    displayAnswer(inputtedID,answerText, index){
        console.log('answerText: ' + answerText);
        console.log('index: ' + index);
        var buttonStyle = {backgroundColor: '#efb430', width: '150px', height: '40px', textAlign: 'center',
            margin: '10px 10px 5px 3px', boxShadow: '3px 3px 5px rgba(60, 60, 60, 0.4)', color: '#fff',
            fontWeight: '300', fontSize: '22px', display: 'inline-block'};
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
        console.log('elaboration is :' + elaboration);
        var allRequests = this.allRequests;
        var that = this;

        var questions = allRequests[elaboration].question;
        var answers = allRequests[elaboration].answer;
        var parts = elaboration.split('_');
        that.updatedID = parts[parts.length-1];
        var buttonStyle = {backgroundColor: '#efb430', width: '150px', height: '40px', textAlign: 'center',
            margin: '10px 10px 5px 3px', boxShadow: '3px 3px 5px rgba(60, 60, 60, 0.4)', color: '#fff',
            fontWeight: '300', fontSize: '22px', display: 'inline-block'};
        return(
            <div key={elaboration}>
              <div className="elaboration-question" style={{backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid', width: '800px', fontSize: '20px'}}>
                <p className="elaboration-question-text" key={parts}>
                Question {that.updatedID}:
                <p1 className="elaboration-question">{questions}</p1><br/>
                </p>
              </div>
              <div className="elaboration-answer">
                {answers != null && answers.map(that.displayAnswer.bind(this,elaboration))}
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
        //console.log('draft in Elab: ' + this.state.draft);
        return (
          <div>
          <div style={{
              textAlign: 'center',
              margin: '0 auto',
          }}>
          <h2>All Questions & Answers</h2>
          {this.state.dataRetrieved ? this.requestID.map(this.displayQuestion) : <p> Loading... </p> }
          </div>
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
