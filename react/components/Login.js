import React from 'react';
import {FormGroup, FormControl, Button} from 'react-bootstrap';
//import ActiveDirectory from 'activedirectory2';


class Login extends React.Component {

    constructor (props) {
        super (props);
        this.emailChange = this.emailChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.emailValidation = this.emailValidation.bind(this);
        this.state = {
            email: '',
            password: ''
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.emailValidation = this.emailValidation.bind(this);
        this.authenticate = this.authenticate.bind(this);

    }


    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    // TODO: needs styling
    render () {
        return (
            <form>
                <FormGroup
                    controlId="email"
                    validationState={this.emailValidation()}>
                    <FormControl
                        type="text"
                        placeholder="@ucsd.edu"
                        onChange={this.emailChange}
                        value={this.state.email}
                        style= {
                        {   padding: '20px',
                            margin: '20px',
                            width: '400px'
                        }
                    }/>
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                    controlId="password">
                    <FormControl
                        type="password"
                        onChange={this.passwordChange}
                        value={this.state.password}
                        style= {
                        {   padding: '20px',
                            margin: '20px',
                            width: '400px'
                        }}
                        placeholder="password"/>
                    <FormControl.Feedback />
                    <Button style={{margin:'20px'}} bsStyle="success" onClick={this.authenticate}>Login</Button>
                </FormGroup>
            </form>
        );
    }

    // return true if email id is a valid email
    emailValidation () {
        let email = this.state.email;
        if (email.includes ('@ucsd.edu')) {
            return 'success';
        }
        else {
            return 'error';
        }
    }

    authenticate() {
        //const username = this.state.email;
        //const password = this.state.password;
        // set redux state to true
        // link to new page
    }

    passwordChange (e) {
        this.setState ({
            password: e.target.value
        });
    }

    emailChange (e) {
        this.setState ({
            email: e.target.value
        });
        console.log (this.state.email);
    }


}

export default Login;
