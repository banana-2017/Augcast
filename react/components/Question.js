import React from 'react';
//import { database } from './../../database/database_init';
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
            hover: false,
        };

        // Bind all functions so they can refer to "this" correctly
        this.updateFields = this.updateFields.bind(this);
        this.newRequest = this.newRequest.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleHover = this.toggleHover.bind(this);
        this.cancelButton = this.cancelButton.bind(this);
        this.submitButton = this.submitButton.bind(this);
    }

    updateFields(){
        this.setState({question: this.props.question,
            endorsed: this.props.endorsed, q_userName: this.props.q_userName});
    }

    toggleEdit() {
        this.setState({editing: !this.state.editing});
    }

    toggleHover() {
        this.setState({hover: !this.state.hover});
    }

    cancelButton(event) {
        {this.toggleHover()}
        {this.toggleEdit()}
    }

    submitButton(event) {
        {this.toggleHover()}
        {this.toggleEdit()}
        {this.props.handleSubmit()}
    }

    newRequest() {
        var containerStyle = {backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid',
            width: '800px', fontSize: '25px'};
        if (this.state.editing) {
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
                            defaultValue= {this.props.question}
                            onChange={this.props.handleEdit}/>
                        <div className="request-buttons">
                            <a style={buttonStyle} onClick={this.props.handleSubmit}>
                                Submit
                            </a>
                            <a style={buttonStyle} onClick={this.cancelButton}>
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            );
        } else {
            var textStyle;
            if(this.state.hover) {
                textStyle = {backgroundColor: '#efb430', borderColor: '#efb430', borderStyle: 'solid',
                    width: '800px', fontSize: '25px', color: 'white'};
            } else {
                textStyle = containerStyle;
            }
            return (
                <div className="request-new" style={textStyle}>
                    <text onClick={this.toggleEdit}
                          className="request-list-answer" onMouseOver={this.toggleHover} onMouseLeave={this.toggleHover}>
                        New Elaboration Request
                    </text>
                </div>
            );
        }
    }

    render() {
        //console.log('Question in question: ' + this.props.question);
        return (
            <div>
                {this.props.dataRetrieved ? this.updateFields : '' }
                {this.newRequest()}
            </div>
        );
    }
}
//<Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateQuestionFromDB}><Glyphicon glyph="save" /> Update</Button>
export default Question;
