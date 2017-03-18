import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
import Input from 'react-toolbox/lib/input';
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
        this.handleEdit = this.handleEdit.bind(this);
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

    handleEdit(content) {
        this.props.handleEdit(content);
        this.setState({content: content});
    }

    newRequest() {
        if (this.state.editing) {
            return(
                <form className="elab-ask-form">
                    <Input className="elab-input" type="text"
                           label="Please write your question here..."
                           onChange={this.handleEdit}
                           value={this.state.content} />
                    <div className="elab-button">
                        <Button label="Submit" onClick={() => {this.props.handleSubmit(); this.toggleEdit();}} />
                        <Button label="Cancel" onClick={this.cancelButton} />
                    </div>
                </form>
            );
        } else {
            return (
                <Button className="elab-new" onClick={this.toggleEdit}>
                        Ask a question
                </Button>
            );
        }
    }

    render() {
        return (
            <div>
                {this.props.dataRetrieved ? this.updateFields : '' }
                {this.newRequest()}
            </div>
        );
    }
}

export default Question;
