import express from 'express';
import morgan from 'morgan';
import path from 'path';
import authentication from './routes/authentication';
import { adminDatabase } from './database/admin_database_init';
var bodyParser = require('body-parser');
//import labelHandler from './labeler/labelHandler';

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
app.use('/api/login', authentication);

app.use(express.static(path.join(__dirname, 'public')));


router.get('/', function(req, res) {
    res.json({ message: 'API works'});
});

router.route('/label').post(function(req, res) {


    var spawn = require('child_process').spawn;
    var process = spawn('./labeler/labelLauncher.py',
        [req.body.mediaURL,
            req.body.pdfURL,
            req.body.courseID,
            req.body.lectureID]);
    
    // Increment number of active processes
    adminDatabase.ref('/server').once('value').then(function(snapshot) {
        adminDatabase.ref('/server/').update({
            processCount: snapshot.val().processCount + 1
        });
    });

    process.stdout.on('data', function(buffer) {
        var pythonStdout = buffer.toString();
        console.log(pythonStdout);
        var arr = pythonStdout.split('#');
        var split = arr.splice(0,3);
        split.push(arr.join('#'));
        //console.log('Python stdout: ' + split);

        // If receiving progress updateLectures, upload the progress
        if (split[0] === 'mismatch') {
            console.log('Updating lecture ' + split[2] + ' mismatch: ' + split[3]);
            adminDatabase.ref('/lectures/'+split[1]+'/'+split[2]).update({
                labelProgress: 0
            });
        }

        // If receiving progress updateLectures, upload the progress
        if (split[0] === 'audio') {
            console.log('Updating lecture ' + split[2] + ' audio: ' + split[3]);
            adminDatabase.ref('/lectures/'+split[1]+'/'+split[2]).update({
                labelProgress: 0
            });
        }


        // If receiving progress updateLectures, upload the progress
        if (split[0] === 'progress') {
            console.log('Updating lecture ' + split[2] + ' progress: ' + parseInt(split[3]));
            adminDatabase.ref('/lectures/'+split[1]+'/'+split[2]).update({
                'labelProgress': parseInt(split[3])
            });
        }

        // If receiving slide text contents, upload the contents
        else if (split[0] === 'content') {
            console.log('Updating lecture ' + split[2] + ' content: ' + split[3]);
            adminDatabase.ref('/lectures/'+split[1]+'/'+split[2]).update({
                contents: JSON.parse(split[3])
            });
        }

        // If receiving final timestamps, upload the timestamps
        else if (split[0] === 'result'){
            console.log('Updating lecture ' + split[2] + ' final timestamps: ' + split[3]);

            // Decrement number of active processes and upload final timestamps
            adminDatabase.ref('/server').once('value').then(function(snapshot) {
                var updates = {};
                updates['/server/'] = {processCount: snapshot.val().processCount - 1};
                updates['/lectures/'+split[1]+'/'+split[2]] = {timestamps: JSON.parse(split[3])};
                adminDatabase.ref().update(updates);
            });
        }
    });

    process.stderr.on('data', function(buffer) {
        console.log(buffer.toString());
    });

    // Send response to button press (not important what that is)
    console.log('API /label: ' + JSON.stringify(req.body));
    res.json({ message: 'Started labeling at '
        + new Date().toLocaleString() + ': ' + JSON.stringify(req.body)});

});
//res.json({ message: 'Label API received request body at ' + new Date().toLocaleString() + ': ' + JSON.stringify(req.body)});

app.use('/api', router);

// morgan logs requests to the console
app.use(morgan('dev'));

// send all requests to index.html so browserHistory in React Router works
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// listen
var PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log('Production Express server running at localhost:' + PORT);
});
