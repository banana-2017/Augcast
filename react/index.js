const React = require ('react');
const ReactDOM = require ('react-dom');
var database = require('../database/database_init')();

// Write a test JSON object to the database
database.ref('test').set({
    status: "Live",
    appName: "Augcast"
});
console.log("Writing to DB complete");

// React main class
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
