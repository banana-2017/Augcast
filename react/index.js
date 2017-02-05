const React = require ('react');
const ReactDOM = require ('react-dom');
var firebase = require('firebase/app');
require('firebase/database');

// Get credentials
var conf = require('../database/credentials.json');
var config = {
    apiKey: conf.apiKey,
    authDomain: conf.authDomain,
    databaseURL: conf.databaseURL,
    storageBucket: conf.storageBucket
};

// Log in the current app to firebase
firebase.initializeApp(config);
var database = firebase.database();

// Write to the database
database.ref('test').set({
    working: "Live",
});
console.log("Writing to DB complete");

var Main = React.createClass ({
    render: function () {
        return (
            <div>
            <h1>Hello world!</h1>
            <h2>Is Firebase working?</h2>
            <h3>It should say "Live" on the following line.</h3>
            <h4>{this.props.dbRead}</h4>
            </div>
        )
    }
});

database.ref('/test').once('value').then(function(snapshot) {
    ReactDOM.render (<Main dbRead= {snapshot.val().working} />,
    document.getElementById('app'));
});
