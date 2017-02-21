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
    }

    render () {

        return (
            <form>
                <FormGroup controlId="email" validationState={this.emailValidation()}>
                    <FormControl
                        type="text"
                        value={this.state.email}
                        placeholder="@ucsd.edu"
                        onChange={this.handleChange}
                        style= {
                        {   padding: '20px',
                            margin: '20px',
                            width: '400px'
                        }
                    }/>
                    <FormControl.Feedback />
                </FormGroup>
                <FormGroup controlId="password">
                    <FormControl
                        type="text"
                        value={this.state.password}
                        style= {
                        {   padding: '20px',
                            margin: '20px',
                            width: '400px'
                        }}
                        placeholder="password"/>
                    <FormControl.Feedback />
                    <Button style={{margin:'20px'}} bsStyle="success">Login</Button>
                </FormGroup>
            </form>
        );
    }

    // return true if email id is a valid email
    emailValidation () {

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
