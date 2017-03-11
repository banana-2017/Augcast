import React from 'react';
//import { database } from './../../database/database_init';
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
            answer: [],
            a_userName: '',
            dataRetrieved: false,
        };

        this.targetID = undefined;

        // Bind all functions so they can refer to "this" correctly
        this.updateFields = this.updateFields.bind(this);
        this.editAnswer = this.editAnswer.bind(this);
    }

    updateFields(){
        this.setState({answer: this.props.answer, a_userName: this.props.a_userName});
    }

    editAnswer(event) {
        this.setState({draft: event.target.value});
    }

    render() {
        return (
          <div>
            {this.props.dataRetrieved ? this.updateFields : '' }
            </div>
        );
    }
}
//<Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateQuestionFromDB}><Glyphicon glyph="save" /> Update</Button>
export default Answer;
