import React from 'react';
import {FormGroup, FormControl, Button} from 'react-bootstrap';
//import ActiveDirectory from 'activedirectory2';


class Login extends React.Component {

    constructor (props) {
        super (props);
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

    render () {

        return (
            <form>
                <FormGroup
                    controlId="email"
                    validationState={this.emailValidation()}>
                    <FormControl
                        type="text"
                        placeholder="@ucsd.edu"
                        value={this.state.email}
                        onChange={this.handleEmailChange}
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
                        type='password'
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
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
        const input = this.state.email;
        if (input.endsWith('@ucsd.edu')) return 'success';
        if (input.length != 0) return 'error';
    }

    authenticate() {
        //const username = this.state.email;
        //const password = this.state.password;
        // set redux state to true
        // link to new page
    }

/*
    authenticate (username, password) {

        var config = { url: 'ldap://ad.ucsd.edu',
            baseDN: '',
            username: 'pkela@ad.ucsd.edu',
            password: 'pass' };
        var ad = new ActiveDirectory(config);

        ad.authenticate(username, password, function(err, auth) {
            if (err) {
                console.log('ERROR: '+JSON.stringify(err));
            }

            if (auth) {
                console.log('Authenticated with ' + username);
            }
            else {
                console.log('Authentication failed!');
            }
        });
    }
    */

}

export default Login;
