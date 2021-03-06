import React from 'react';
import { database } from './../../database/database_init';
import Question from './Question';
import CurrentQuestion from './CurrentQuestion';
import {connect} from 'react-redux';
import Dialog from 'react-toolbox/lib/dialog';

const NAME = 'elaboration_id_';

class ElabRequest extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            author:'',
            a_username:'',
            endorsed:'',
            content: '',
            draft: '',
            dataRetrieved: false,
            // Used to store all elab info from database
            allRequests: undefined,
            // All elab ID under it
            requestID: undefined,

            // UI state
            alertActive: false,
            alertText: 'Nothing Wrong'
        };

        this.updatedID = 0;

        // Bind all functions so they can refer to "this" correctly
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.displayQuestion = this.displayQuestion.bind(this);
        this.editAnswer = this.editAnswer.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
        this.removeQuestion = this.removeQuestion.bind(this);
        this.firebaseQuery = this.firebaseQuery.bind(this);
    }

    // Grab initial data from database
    componentDidMount() {
        var that = this;
        database.ref('/elaborations/' + that.props.course + '/' + that.props.lecture + '/' + this.props.timestamp).once('value').then(function(snapshot) {
            that.setState({allRequests: snapshot.val()});
            if(that.state.allRequests!=null){
                that.setState({requestID: Object.keys(snapshot.val())});
            }
            that.setState({dataRetrieved: true});
        });
    }

    // new props are in newProps
    // old props are in this.props
    // Do query using info in newProps
    componentWillReceiveProps(newProps) {
        var that = this;
        if(newProps.timestamp !== undefined) {
            this.setState({allRequests: undefined});
            this.setState({requestID: undefined});
            database.ref('/elaborations/' + newProps.course + '/' + newProps.lecture + '/' + newProps.timestamp).once('value').then(function(snapshot) {
                that.setState({
                    allRequests: snapshot.val(),
                    dataRetrieved: true
                });
                if(snapshot.val() !== null){
                    that.setState({requestID: Object.keys(snapshot.val())});
                }
            });
        }
    }

    // edit field for submitting ER
    handleEdit(content) {
        this.setState({content: content});
    }

    // edit answer for each ER
    editAnswer(answer){
        this.setState({draft: answer});
    }

    // Firebase query once //
    firebaseQuery(id){
        this.setState({allRequests: undefined});
        this.setState({requestID: undefined});
        var that = this;
        database.ref('/elaborations/' + that.props.course + '/' + that.props.lecture + '/' + this.props.timestamp).once('value').then(function(snapshot) {
            that.setState({allRequests: snapshot.val()});
            if(that.state.allRequests!=null){
                that.setState({requestID: Object.keys(snapshot.val())});
            }
            that.setState({dataRetrieved: true});
        });
    }

    // updating ER to database
    handleSubmit() {
        if(this.state.content!=''){
            var postData = {
                content:this.state.content,
                endorsed:this.state.endorsed,
                author:this.props.username,
            };
            var updates = {};
            this.updatedID = parseInt(this.updatedID)+1;
            this.setState({updatedID: this.updatedID});
            updates['/elaborations/' + this.props.course + '/' + this.props.lecture + '/' + this.props.timestamp + '/' + (NAME + this.updatedID)] = postData;
            database.ref().update(updates);
            //window.location.reload();

            // Clear the question field after it has been submitted
            this.setState({content: ''});

            // Firebase query once //
            this.firebaseQuery();
        }
        else{
            this.setState({ alertText: 'You did not include any text!', alertActive: true });
        }
    }

    // Update answer to database
    submitAnswer(inputtedID) {
        if(this.state.draft==''){
            this.setState({ alertText: 'You did not write any answer!', alertActive: true });
            return;
        }

        var updates = {};
        var newPostKey = database.ref('/elaborations/' + this.props.course + '/' + this.props.lecture + '/' + this.props.timestamp + '/' + inputtedID + '/' + 'answers').push().key;
        var answerObj = {
            content: this.state.draft,
            a_username: this.props.username,
        };
        updates['/elaborations/' + this.props.course + '/' + this.props.lecture + '/' + this.props.timestamp + '/' + inputtedID + '/answers/' + newPostKey] = answerObj;
        database.ref().update(updates);

        // Clear the answer field after it has been submitted
        this.setState({draft: ''});
        // Firebase query once //
        this.firebaseQuery();
    }

    // remove answer of ID from database
    removeAnswer(inputtedID, index) {
        database.ref('/elaborations/' + this.props.course + '/' + this.props.lecture + '/' + this.props.timestamp + '/' + inputtedID + '/answers/' + index).remove();
        //window.location.reload();

        // Firebase query once //
        this.firebaseQuery();
    }

    removeQuestion(inputtedID){
        database.ref('/elaborations/' + this.props.course + '/' + this.props.lecture + '/' + this.props.timestamp + '/' + inputtedID).remove();
        //window.location.reload();
        this.firebaseQuery();
    }


    // Display ER to user
    displayQuestion(elaboration) {
        var allRequests = this.state.allRequests;
        var that = this;
        var questions = allRequests[elaboration].content;
        var question_owner = allRequests[elaboration].author;
        var answers = allRequests[elaboration].answers;
        var answer_owner = [];
        var keys = undefined;
        if (answers != null && answers != undefined){
            keys = Object.keys(answers);
        }
        var answers2 = [];
        if (answers != null && answers != undefined){
            JSON.parse(JSON.stringify(answers), (key, value) => {
                if(key=='content'){
                    answers2 = answers2.concat(value);
                }
                if(key=='a_username'){
                    answer_owner = answer_owner.concat(value);
                }
            });
        }
        var parts = elaboration.split('_');
        that.updatedID = parts[parts.length-1];
        return(
            <CurrentQuestion key={elaboration}
                             elaboration={elaboration}
                             question={questions}
                             answers={answers2}
                             answer_owner={answer_owner}
                             parts={parts}
                             keys={keys}
                             removeAnswer={this.removeAnswer}
                             removeQuestion={this.removeQuestion}
                             submitAnswer={this.submitAnswer}
                             editAnswer={this.editAnswer}
                             question_owner={question_owner}
                             user={this.props.username}
                             course={this.props.course}
                             lecture={this.props.lecture} />
        );
    }

    render() {
        let handleToggle = () => {
            this.setState({alertActive: false});
        };

        return (
          <div className="elab-container">
              <div className="elab-list">
                  { this.state.dataRetrieved && this.state.requestID!=undefined ?
                      this.state.requestID.map(this.displayQuestion) : <div className="elab-empty">No questions yet</div> }
              </div>
              <Question handleEdit={this.handleEdit} handleSubmit={this.handleSubmit} />

              <Dialog
                  actions={[ {label: 'OK', onClick: handleToggle} ]}
                  active={this.state.alertActive}
                  onEscKeyDown={handleToggle}
                  onOverlayClick={handleToggle}
              >
                  <p>{this.state.alertText}</p>
              </Dialog>
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
