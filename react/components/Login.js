import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {logIn} from '../redux/actions';
import {auth} from '../../database/database_init';

// UI components
import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';

class Login extends React.Component {

    constructor (props) {
        super (props);
        this.emailChange = this.emailChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.keyEvent = this.keyEvent.bind (this);

        this.state = {
            email: '',
            password: '',
            valid: false,
            error: ''
        };

    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    // handle enter key
    keyEvent (e) {
        if (e.key === 'Enter') {
            this.authenticate();
        }
    }

    render () {
        document.title = 'Login - Augcast';
        return (
            <div className="login-wrapper" onKeyPress={this.keyEvent}>
                <div className="animateme">
                    <ul className="bg-bubbles">
                        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                    </ul>
                </div>
                <div className="login">
                    <div className="login-title" />
                    <div className="login-input">
                        <Input className="email-input" type="email" label="Your UCSD Email" icon="email" value={this.state.email} onChange={this.emailChange} />
                        <Input className="password-input" type="password" label="Password" icon="vpn_key" value={this.state.password} onChange={this.passwordChange} />
                    </div>
                    <Button className="login-button"
                            label="LOG IN" flat primary
                            onClick={this.authenticate}/>
                    <div id="login-error">{this.props.isFetching?'Logging in...':this.state.error}</div>
                </div>
            </div>
        );
    }

    authenticate() {
        const email = this.state.email;
        const password = this.state.password;
        const {dispatch, router} = this.props;
        var that = this;
        this.setState ({
            error: ''
        });

        if (email.endsWith ('@ucsd.edu')) {
            dispatch (logIn (email, password, router)).then(
                success => {
                    if (!success) {
                        that.setState ({
                            error: 'Login failed. Please check your UCSD credentials'
                        });
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
        else {
            this.setState ({
                error: 'Please enter a valid ucsd.edu email'
            });
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

function mapStateToProps (state) {
    return {
        isFetching: state.isFetching
    };
}
const LoginContainer = connect (mapStateToProps)(withRouter(Login));

export default LoginContainer;
