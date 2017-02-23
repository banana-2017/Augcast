import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Login from './components/Login';
import { createStore } from 'redux';
import VideoView from './components/VideoView';
import Upload from './components/Upload';
import PDFDisplay from './components/PDFDisplay';
import appReducers from './redux/reducers';


// eslint-disable-next-line
import React from 'react';      // used for jsx



let store = createStore (appReducers);
module.exports = (
    <Route path="/" component = {App}>
        <IndexRoute component = {Home} onEnter = {authenticate}>
        </IndexRoute>
        <Route path="/videoview" component={VideoView} />
        <Route path="/login" component = {Login}/>
        <Route path="/upload" component = {Upload}/>
        <Route path="/pdf" component={PDFDisplay} />
    </Route>
);



/**
 * gets login state from store and redirects route
 *
 * nextState: current state of the router
 * replace: triggers transition to different URL
 * callback: continues transition
 */
function authenticate (nextState, replace, transition) {
    let {loggedIn} = store.getState();
    console.log (loggedIn);

    if (!loggedIn) {
        replace ('/login');
    }


    transition();
}
