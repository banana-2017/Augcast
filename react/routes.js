import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomeContainer from './components/Home';
import Login from './components/Login';
import PodcastView from './components/PodcastView';
import Upload from './components/Upload';
import PDFDisplay from './components/PDFDisplay';
import Test from './components/Test';
import Sidebar from './components/Sidebar/Sidebar';
import {authenticate} from './index';


// eslint-disable-next-line
import React from 'react';      // used for jsx



module.exports = (
    <Route path="/" component = {App} >
        // <IndexRoute component = {HomeContainer} onEnter={authenticate} ></IndexRoute>
        <IndexRoute component = {HomeContainer} ></IndexRoute>
        <Route path="/login" component = {Login}/>
        <Route path="/podcastview" component={PodcastView} />
        <Route path="/upload" component = {Upload}/>
        <Route path="/pdf" component={PDFDisplay} />
        <Route path="/test" component={Test} />
        <Route path="/sidebar" component={Sidebar} />
        <Route path="/pdfdisplay" component={PDFDisplay} />
        <Route path="/:courseID" component={HomeContainer}>
            <Route path="/:courseID/:lectureNum" component={HomeContainer} />
        </Route>
    </Route>
);
