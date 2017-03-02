import React from 'react';
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
        };

        // Bind all functions so they can refer to "this" correctly
        this.updateFields = this.updateFields.bind(this);
    }

    updateFields(event){
        this.setState({answer: this.props.answer, a_userName: this.props.a_userName})
    }

    render() {
        console.log('Answer in Answer: ' + this.props.answer);
        return (
            <div>
            {this.props.dataRetrieved ? this.updateFields : '' }
            </div>
        );
    }
}
//<Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateQuestionFromDB}><Glyphicon glyph="save" /> Update</Button>
export default Answer;
