import express from 'express';
import morgan from 'morgan';
import path from 'path';
var bodyParser = require('body-parser');

// eslint-disable-next-line
import React from 'react';     // jsx rendered as React.createElement

let __dirname = path.resolve();

var app = express();
var router = express.Router();  //Instance of Express Router
// Configure app to use bodyParser()
// This will let us get the data from a POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/css', express.static(__dirname + '/public/css/'));
app.use(express.static(path.join(__dirname, 'public')));


router.get('/', function(req, res) {
    res.json({ message: 'API works'});
});

router.route('/label').post(function(req, res) {
    var spawn = require('child_process').spawn;
    var process = spawn('python', ['./labeler/test.py']);

    console.log('API /label: ' + JSON.stringify(req.body));

    process.stdout.on('data', function(data) {
        console.log(data.toString());
        res.json({ message: 'Label API received request body at '
            + new Date().toLocaleString() + ': ' + JSON.stringify(req.body)});
    });

    //res.json({ message: 'Label API received request body at ' + new Date().toLocaleString() + ': ' + JSON.stringify(req.body)});
});

app.use('/api', router);

// morgan logs requests to the console
app.use(morgan('dev'));

console.log (__dirname);

// send all requests to index.html so browserHistory in React Router works
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// listen
var PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log('Production Express server running at localhost:' + PORT);
});
