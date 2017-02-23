import express from 'express';
import morgan from 'morgan';
import path from 'path';

// eslint-disable-next-line
import React from 'react';     // jsx rendered as React.createElement

var app = express();

app.use('/css', express.static(__dirname + '/public/css/'));

// morgan logs requests to the console
app.use(morgan('dev'));

// send all requests to index.html so browserHistory in React Router works
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// listen
var PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log('Production Express server running at localhost:' + PORT);
});
