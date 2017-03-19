import React from 'react';
import { Button } from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';

class Question extends React.Component {
    constructor() {
        super();

        // Initial state
        this.state = {
            content: '',
            editing: false,
        };

        // Bind all functions so they can refer to "this" correctly
        this.handleEdit = this.handleEdit.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.submitButton = this.submitButton.bind(this);
    }

    toggleEdit() {
        this.setState({editing: !this.state.editing});
    }

    submitButton() {
        this.setState({editing: !this.state.editing});
        this.props.handleSubmit();
    }

    handleEdit(content) {
        this.props.handleEdit(content);
    }

    render() {
        if (this.state.editing) {
            return(
                <form className="elab-ask-form">
                    <Input className="elab-input" type="text"
                           label="Please write your question here..."
                           onChange={this.handleEdit}
                    />
                    <div className="elab-button">
                        <Button label="Submit" onClick={this.submitButton} />
                        <Button label="Cancel" onClick={this.toggleEdit} />
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
}

export default Question;
