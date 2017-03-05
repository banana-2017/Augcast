import React from 'react';
import { database } from './../../database/database_init';
// import { database } from './../../database/database_init';
// import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

/**
ElabRequest
*/
//const NAME = 'elaboration_id_'
class Answer extends React.Component {
    constructor() {
        super();
        // Initial state
        this.state = {
            draft:'Please write your answer here...',
            answer: [],
            a_userName: '',
            dataRetrieved: false,
            expand: false,
        };

        this.targetID = undefined;

        // Bind all functions so they can refer to "this" correctly
        this.updateFields = this.updateFields.bind(this);
        this.editAnswer = this.editAnswer.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);

        this.displayQuestion = this.displayQuestion.bind(this);
        this.displayAnswer = this.displayAnswer.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    updateFields(event){
        this.setState({answer: this.props.answer, a_userName: this.props.a_userName})
    }

    editAnswer(event) {
        this.setState({draft: event.target.value});
    }

    submitAnswer(event) {
        //var newPostKey = database.ref().child('elab-request').push().key;
        var updates = {};
        var temp = this.state.answer.push(this.state.draft);
        this.setState({answer: temp});
        updates['/elab-request/' + targetID + '/' + 'answer'] = this.state;
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
        var allRequests = this.props.allRequests;
        var that = this;

        var questions = allRequests[elaboration].question;
        var answers = allRequests[elaboration].answer;
        var parts = elaboration.split("_")
        that.updatedID = parts[parts.length-1]
        console.log(elaboration)
        console.log(that.updatedID)

        if (this.state.expand) {
            return(
                <div className="elaboration-question" style={{backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid',
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
                <div className="elaboration-question" style={{backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid',
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
      var allRequests = this.props.allRequests;
      var that = this;
      var num = 'a';

      // render single elaboration item
      var requestList = function(elaboration) {
          var questions = allRequests[elaboration].question;
          var answers = allRequests[elaboration].answer;
          var parts = elaboration.split("_")
          that.updatedID = parts[parts.length-1]
          console.log(elaboration)
          console.log(that.updatedID)
          return (
            <div>
              <p className="elaboration-item" key={parts}>
                  Question {that.updatedID}:<br/>
                  <p1 className="elaboration-question">{questions}</p1><br/>
                  Answer {that.updatedID}:
                  {answers != null &&
                    <p2 className="elaboration-answer">{answers.map((k, index) => <li key={index}>{ `${k}` }</li>) }</p2>
                  }
              </p>
              <label>
                <textarea key={elaboration} value={that.state.draft} onChange={that.editAnswer} /><br/>
              </label>
            </div>
          );
      };
      console.log("question in Elab: " + this.state.question);
      console.log("dataRetrieved in Elab: " + this.state.dataRetrieved);
      return (
          <div>
          <div style={{
                  textAlign: 'center',
                  margin: '0 auto',
              }}>
              <h2>All Questions & Answers</h2>
              {this.props.dataRetrieved ? this.props.requestID.map(this.displayQuestion) : <p> Loading... </p> }
          </div>
            {this.props.dataRetrieved ? this.updateFields : '' }
            </div>
        );
    }
}
//<Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateQuestionFromDB}><Glyphicon glyph="save" /> Update</Button>
export default Answer;
