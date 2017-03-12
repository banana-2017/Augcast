import React from 'react';

var user = 'Kiki';

class CurrentQuestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            content: 'Please write your question here...',
            draft:'Please write your answer here...',
            endorsed: false,
            expand: false,
            elaboration: this.props.elaboration,
            question: this.props.question,
            answers: this.props.answers,
            answer_owner: this.props.answer_owner,
            parts: this.props.parts,
            keys: this.props.keys,
        }

        this.displayAnswer = this.displayAnswer.bind(this);
        this.display = this.display.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    toggleExpand() {
        this.setState({expand: !this.state.expand});
    }

    displayAnswer(rawIndex,inputtedID, answer_owner, answerText,filler){
        var buttonStyle = {backgroundColor: '#efb430', width: '60px', height: '20px', textAlign: 'center',
            margin: '10px 10px 5px 3px', boxShadow: '3px 3px 5px rgba(60, 60, 60, 0.4)', color: '#fff',
            fontWeight: '300', fontSize: '14px', display: 'inline-block'};


        console.log('answer_owner: ' + answer_owner);
        console.log('rawIndex: ' + rawIndex);
        console.log('inputtedID: ' + inputtedID);
        console.log('filler: ' + filler);
        console.log('answerText: ' + answerText);
        var owner = answer_owner[filler];
        console.log('owner: ' + owner);

        var index = rawIndex[filler];
        return(
            <div className="elaboration-oneAnswer" key={index}>
                <li className="elaboration-oneAnswer-text">{answerText} ----- Posted By {owner}</li>
                <form>
                    {owner==user&&
                    <a style={buttonStyle} onClick={() => {this.props.removeAnswer(inputtedID, index);}}>
                        Delete
                    </a>}
                </form>
            </div>
        );
    }

    display(){
        var buttonStyle = {backgroundColor: '#efb430', width: '150px', height: '40px', textAlign: 'center',
            margin: '10px 10px 5px 3px', boxShadow: '3px 3px 5px rgba(60, 60, 60, 0.4)', color: '#fff',
            fontWeight: '300', fontSize: '22px', display: 'inline-block'};
        var containerStyle = {backgroundColor: 'white', borderColor: '#efb430', borderStyle: 'solid',
            width: '800px', fontSize: '20px'};
        var inputStyle = {margin: '5px 5px 5px 5px', width: '780px', height: '100px'};
        var extra = [];

        if (this.state.expand) {
            return (
                <div className="elaboration-question" style={containerStyle}>
                    <p className="elaboration-question-text" key={this.state.parts}>
                        {this.state.question}<br/>
                    </p>

                    <div className="elaboration-answer">
                        {this.state.answers.map(
                            this.displayAnswer.bind(extra, this.state.keys, this.state.elaboration, this.state.answer_owner))}
                    </div>

                    <div className="elaboration-new-answer">
                        <input
                            className="elaboration-answer-input"
                            style={inputStyle}
                            type="text"
                            defaultValue={this.state.draft}
                            onChange={this.props.editAnswer}/>

                        <div className="elaboration-new-answer-button">
                            <a style={buttonStyle} onClick={() => {this.props.submitAnswer(this.state.elaboration);
                                            this.toggleExpand();
                            }}>
                                Submit
                            </a>
                            <a style={buttonStyle} onClick={this.toggleExpand}> Cancel </a>
                        </div>

                    </div>

                </div>
            );
        } else {
            return (
                <div className="elaboration-question" style={containerStyle}>
                    <p className="elaboration-question-text" key={this.state.parts} onClick={this.toggleExpand}>
                        {this.state.question}<br/>
                    </p>
                </div>
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
