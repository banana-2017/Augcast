const React = require ('react');
const ReactDOM = require ('react-dom');
var firebase = require('firebase/app');
require('firebase/database');

var Main = React.createClass ({
    render: function () {
        return (
            <div>
                Hello World!
            </div>
        )
    }
});

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
database.ref('test/testing').set({
    key1: "value1",
    key2: "value2"
});
console.log("Writing to DB complete");

ReactDOM.render (<Main/>, document.getElementById('app'));
