import React from 'react';
// import { database } from './../../database/database_init';
// import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

/**
 ElabRequest
 */
//const NAME = 'elaboration_id_'
class Question extends React.Component {
    constructor() {
        super();
        // Initial state
        this.state = {
            question: '',
            endorsed: false,
            q_userName: '',
            editing: false,
        };

        // Bind all functions so they can refer to "this" correctly
        this.updateFields = this.updateFields.bind(this);
        this.newRequest = this.newRequest.bind(this);
    }

    updateFields(event){
        this.setState({question: this.props.question,
            endorsed: this.props.endorsed, q_userName: this.props.q_userName})
    }

    newRequest() {
        if (this.state.editing) {
            return(
                <div className="request-new">
                    <form onSubmit={this.handleSubmit}>
                        <input
                            type="text"
                            className="form-control"
                            defaultValue= {this.state.question}
                        /><br />
                        <Button bsStyle="primary" onClick={this.toggleRequestEditing}>
                            Submit
                        </Button>
                        <Button bsStyle="primary" onClick={this.toggleRequestEditing}>
                            Cancel
                        </Button>
                    </form>
                </div>
            );
        } else {
            return (
                <div className="request-new">
                    <text onClick={this.toggleRequestEditing}
                          className="request-list-answer">
                        New Elaboration Request
                    </text>
                </div>
            );
        }
    }

    render() {
        console.log('Question in question: ' + this.props.question);
        return (
            <div>
                {this.props.dataRetrieved ? this.updateFields : '' }
                <div
                    style={{
                        textAlign: 'center',
                        margin: '0 auto',
                        width: '560px',
                    }} >
                    <h2> Elaboration Request</h2>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Question:<textarea value={this.props.question} onChange={this.props.handleEdit} />
                        </label>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }
}
//<Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateQuestionFromDB}><Glyphicon glyph="save" /> Update</Button>
export default Question;
