import express from 'express';
import React from 'react'

// We'll use this to render our app to an html string
import { renderToString } from 'react-dom/server'
// and these to match the url to routes and then render
import { match, RouterContext } from 'react-router'
// Get the routes 
import routes from './react/routes.js'

var app = express();

app.get('*', (req, res) => {
	console.log('GET request to path *');
	match({ routes: routes, location: req.url}, (err, redirect, props)=> {
		const appHtml = renderToString(<RouterContext{...props} />);

		res.send(renderPage(appHtml));
	})	
});

function renderPage(appHtml) {
  return `
    <!doctype html public="storage">
    <html>
    <meta charset=utf-8/>
    <title>My First React Router App</title>
    <link rel=stylesheet href=/index.css>
    <div id=app>${appHtml}</div>
    <script src="/bundle.js"></script>
   `
}

/// catch 404 and forwarding to error handler
app.use((req, res, next) => {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.listen(8080, ()=> {
	console.log('Production Express server running at localhost 8080');
});