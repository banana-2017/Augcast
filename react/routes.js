import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomeContainer from './components/Home';
import Login from './components/Login';
import {authenticate} from './index';
import NotFound from './components/NotFound';

// eslint-disable-next-line
import React from 'react';      // used for jsx

        // <IndexRoute component = {HomeContainer} onEnter={authenticate}></IndexRoute>
module.exports = (
    <Route path="/" component = {App} >
        <IndexRoute component = {HomeContainer} onEnter={authenticate}></IndexRoute>
        <Route path="/login" component = {Login}/>
        <Route path="/404" component={NotFound} />
        <Route path="/:courseID" component={HomeContainer} /* onEnter={authenticate} */>
            <Route path="/:courseID/:lectureNum" component={HomeContainer} />
        </Route>
    </Route>
);
