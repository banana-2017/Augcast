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
    status: "Live",
    appName: "Augcast"
});
console.log("Writing to DB complete");

var Main = React.createClass ({
    render: function () {
        return (
            <div>
            <h1>Hello world!</h1>
            <h2>Firebase "test" object: </h2>
            <h4>{this.props.dbRead}</h4>
            </div>
        )
    }
});

// Example of reading the value of the "test" JSON object from the DB
// and then displaying it with React
database.ref('/test').once('value').then(function(snapshot) {
    ReactDOM.render (<Main dbRead= {JSON.stringify(snapshot.val())} />,
    document.getElementById('app'));
});
