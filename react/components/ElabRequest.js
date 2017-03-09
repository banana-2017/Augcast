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
            expand: false,
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
        this.displayAnswer = this.displayAnswer.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    handleEdit(event) {
        this.setState({question: event.target.value});
    }

    handleSubmit(event) {
        //var newPostKey = database.ref().child('elab-request').push().key;
        window.location.href = event.target.href;
        var updates = {};
        this.updatedID = parseInt(this.updatedID)+1
        updates['/elab-request/' + (NAME + this.updatedID)] = this.state;
        database.ref().update(updates);
    }

    toggleExpand() {
        this.setState({expand: !this.state.expand});
    }

    displayAnswer(k, index){
        return(
            <div className="elaboration-oneAnswer" key={index}>
                <text className="elaboration-oneAnswer-text">{ `${k}` }</text>
            </div>
        )
    }

    displayQuestion(elaboration) {
        var allRequests = this.allRequests;
        var that = this;

        var questions = allRequests[elaboration].question;
        var answers = allRequests[elaboration].answer;
        var parts = elaboration.split("_")
        that.updatedID = parts[parts.length-1]
        console.log(elaboration)
        console.log(that.updatedID)

        if (this.state.expand) {
            return(
                <div key={elaboration} className="elaboration-question" style={{backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid',
                    width: '800px', fontSize: '20px'}}>
                    <p className="elaboration-question-text" key={parts}
                       onClick={this.toggleExpand}>
                        Question {that.updatedID}:
                        <p1 className="elaboration-question">{questions}</p1><br/>
                    </p>
                    <div className="elaboration-answer">
                        {answers != null &&
                        <p2 className="elaboration-answer">{answers.map((k, index) => <li key={index}>{ `${k}` }</li>) }</p2>
                        }
                    </div>
                </div>
            )
        } else {
            return (
                <div key={parts} className="elaboration-question" style={{backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid',
                    width: '800px', fontSize: '20px'}}>
                    <p className="elaboration-question-text" key={parts}
                          onClick={this.toggleExpand}>
                        Question {that.updatedID}:
                        <p1 className="elaboration-question">{questions}</p1><br/>
                    </p>
                </div>
            )
        }
    }


    render() {
      console.log("question in Elab: " + this.state.question);
      console.log("dataRetrieved in Elab: " + this.state.dataRetrieved);
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
