import React from 'react';
import {FormGroup, FormControl} from 'react-bootstrap';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {logIn} from '../redux/actions';
import {auth} from '../../database/database_init';

// UI components
import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';
import { Card } from 'react-toolbox/lib/card';


class Login extends React.Component {

    constructor (props) {
        super (props);
        this.emailChange = this.emailChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.emailValidation = this.emailValidation.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.emailValidation = this.emailValidation.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.keyEvent = this.keyEvent.bind (this);

        this.state = {
            email: '',
            password: '',
            valid: false,
            failureMessage: ''
        };

    }


    handleEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    // handle enter key
    keyEvent (e) {
        if (e.keyCode === 13) {
            this.authenticate();
        }
    }

    // TODO: needs styling
    render () {
        document.title = 'Login - Augcast';
        return (
            <div className="login-wrapper">
                <div className="animateme">
                    <ul className="bg-bubbles">
                        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                    </ul>
                </div>
                <Card className="login">
                    <Input className="input-email" type="email" label="Your UCSD Email" icon="email" value={this.state.email} onChange={this.emailChange} />
                    <Input className="input-password" type="password" label="Password" icon="vpn_key" value={this.state.password} onChange={this.passwordChange} />
                    <Button label="LOG IN" flat primary onClick={this.authenticate}/>
                </Card>
            </div>
        );
    }

    // return true if email id is a valid email
    emailValidation () {
        let email = this.state.email;
        if (email.endsWith ('@ucsd.edu')) {
            return 'success';
        }
        else {
            return 'error';
        }
    }

    authenticate() {
        const email = this.state.email;
        const password = this.state.password;
        const {dispatch, router} = this.props;
        if (email.endsWith ('@ucsd.edu')) {
            dispatch (logIn (email, password, router)).then(
                success => {
                    console.log (success);
                    if (!success) {
                        console.log ('Login Failure');
                    }

                    // if ad succeeds, add user to firebase (if doesn't exist)
                    else {
                        auth.signInWithEmailAndPassword(email, password).catch(function(error) {
                            console.log ('New user: '+error);
                            // if user doesn't exist, add user to firebase
                            auth.createUserWithEmailAndPassword(email, password).catch(function(error) {
                                console.log ('error creating account: '+ error.code + ' ' + error.message);
                            });
                        });
                    }
                }
            );
        }
    }

    passwordChange (password) {
        this.setState ({
            password: password
        });
    }

    emailChange (email) {
        this.setState ({
            email: email
        });
    }


}

const LoginContainer = connect ()(withRouter(Login));

export default LoginContainer;
