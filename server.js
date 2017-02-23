import express from 'express';
//import { renderToString } from 'react-dom/server';  // render app to string
//import { match, RouterContext } from 'react-router'; // match url to route
//import routes from './react/routes.js';
import path from 'path';
// eslint-disable-next-line
import React from 'react';     // jsx rendered as React.createElement

var app = express();

let __dirname = path.resolve();
//app.use('/css', express.static(__dirname + '/public/css/'));
app.use ('/', express.static(path.join(__dirname + '/public')));

/*
app.get('/', (req, res) => {
    console.log('GET request to path *');
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
*/
    /*
    match({ routes: routes, location: req.url}, (err, redirect, props)=> {
        // in here we can make some decisions all at once
        if (err) {
            // there was an error somewhere during route matching
            res.status(500).send(err.message);
        } else if (redirect) {
            // route is entered, it can redirect
            res.redirect(redirect.pathname + redirect.search);
        } else if (props) {
            // if we got props then we matched a route and can render
            const appHtml = renderToString(<RouterContext {...props}/>);
            res.send(renderPage(appHtml));
        } else {
            // didn't match any route
            res.status(404).send('Not Found');
        }
    });
    *//*
function renderPage(appHtml) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <link href='http://fonts.googleapis.com/css?family=Roboto:400,300,700' rel='stylesheet' type='text/css'>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css">
        </head>
        <body>
            <div id="app">${appHtml}</div>
        </body>
        </html>
    `;
}
*/


var PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log('Production Express server running at localhost:' + PORT);
});
