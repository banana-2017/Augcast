import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
const TooltipButton = Tooltip(Button);

/**
 ElabRequest
 */
//const NAME = 'elaboration_id_'
class Question extends React.Component {
    constructor() {
        super();
        // Initial state
        this.state = {
            content: '',
            endorsed: false,
            author: '',
            editing: false,
            hover: false,
            rerender:0,
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
        this.setState({content: this.props.content,
            endorsed: this.props.endorsed, author: this.props.author});
    }

    toggleEdit() {
        this.setState({editing: !this.state.editing});
    }

    toggleHover() {
        this.setState({hover: !this.state.hover});
    }

    cancelButton() {
        {this.toggleHover();}
        {this.toggleEdit();}
    }

    submitButton() {
        {this.toggleHover();}
        {this.toggleEdit();}
        {this.props.handleSubmit();}
    }

    newRequest() {
        var containerStyle = {};
        // var containerStyle = {backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid',
        //     width: '800px', fontSize: '25px'};
        if (this.state.editing) {
            var buttonStyle = {};
            // var buttonStyle = {backgroundColor: '#efb430', width: '150px', height: '40px', textAlign: 'center',
            //     margin: '10px 10px 5px 3px', boxShadow: '3px 3px 5px rgba(60, 60, 60, 0.4)', color: '#fff',
            //     fontWeight: '300', fontSize: '22px', display: 'inline-block'};

            return(
                <div className="request-new" style={containerStyle}>
                    <form>
                        <input
                            className="request-new-input"
                            style={{margin: '5px 5px 5px 5px', width: '780px', height: '100px'}}
                            type="text"
                            placeholder= 'Please write your question here...'
                            onChange={this.props.handleEdit}/>
                        <div className="request-buttons">
                            <a style={buttonStyle} onClick={() =>
                              {this.props.handleSubmit();
                                this.toggleEdit();
                            }}>
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
                textStyle = {};
                // textStyle = {backgroundColor: '#efb430', borderColor: '#efb430', borderStyle: 'solid',
                //     width: '800px', fontSize: '25px', color: 'white'};
            } else {
                textStyle = containerStyle;
            }
            return (
                <Button className="elab-new" onClick={this.toggleEdit}>
                        Ask a question
                </Button>
            );
        }
    }

    render() {
        //console.log('Question in content: ' + this.props.content);
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