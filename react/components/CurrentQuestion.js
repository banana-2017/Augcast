import React from 'react';
import {MenuItem} from 'react-toolbox/lib/menu';
import {Button} from 'react-toolbox/lib/button';
import Input from 'react-toolbox/lib/input';

class CurrentQuestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            content: 'Please write your question here...',
            draft:'Please write your answer here...',
            endorsed: false,
            expand: false
        };

        this.displayAnswer = this.displayAnswer.bind(this);
        this.display = this.display.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    toggleExpand() {
        this.setState({expand: !this.state.expand});
    }

    displayAnswer(rawIndex, inputtedID, answer_owner, answerText, filler){
        var owner = answer_owner[filler];

        var index = rawIndex[filler];
        return(
            <div className="elaboration-oneAnswer" key={index}>
                <div className="elaboration-oneAnswer-text">{answerText} ----- Posted By {owner}</div>
                <form>
                    {owner==this.props.user&&
                    <a onClick={() => {this.props.removeAnswer(inputtedID, index);}}>
                        Delete
                    </a>}
                </form>
            </div>
        );
    }

    editAnswer(draft) {
        this.props.editAnswer(draft);
        this.setState({draft: draft});
    }

    display(){
        var extra = [];

        if (this.state.expand) {
            return (
                <div className="elab-post">
                    <p className="elaboration-question-text" key={this.props.parts}>
                        {this.props.question} (asked by {this.props.question_owner}) <br/>
                    </p>
                    <div className="elaboration-answer">
                        {this.props.answers.map(
                            this.displayAnswer.bind(extra, this.props.keys, this.props.elaboration, this.props.answer_owner))}
                    </div>

                    <div className="elaboration-new-answer">
                        <Input
                            className="elab-input"
                            type="text"
                            label='Please write your answer here...'
                            onChange={this.props.editAnswer} />

                        <div className="elab-answer-button">
                            <Button label="Submit" onClick={() => {this.props.submitAnswer(this.props.elaboration);}} />
                            <Button label="Cancel" onClick={this.toggleExpand} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <MenuItem className="elab-post" onClick={this.toggleExpand} key={this.props.parts}>
                    <div className="elab-question">{this.props.question}</div><div className="elab-question-author">{this.props.question_owner}</div>
                </MenuItem>
            );
        }
    }

    render() {
        return (
            <div>{this.display()}</div>
        );
    }



}
export default CurrentQuestion;
