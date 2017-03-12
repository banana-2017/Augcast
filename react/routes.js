import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomeContainer from './components/Home';
import Login from './components/Login';
import PodcastView from './components/PodcastView';
import Upload from './components/Upload';
import PDFDisplay from './components/PDFDisplay';
import Sidebar from './components/Sidebar/Sidebar';
import {authenticate} from './index';
import InstructorPanel from './components/InstructorPanel';

// eslint-disable-next-line
import React from 'react';      // used for jsx

module.exports = (
    <Route path="/" component = {App} >
<<<<<<< HEAD
        <IndexRoute component = {HomeContainer} /*onEnter={authenticate}*/></IndexRoute>
=======
        <IndexRoute component = {HomeContainer} /*onEnter={authenticate}*//>
>>>>>>> 3e9e365fb6c5b405755f3a276b5a9d896279f2bd
        <Route path="/login" component = {Login}/>
        <Route path="/podcastview" component={PodcastView} />
        <Route path="/upload" component = {Upload}/>
        <Route path="/pdf" component={PDFDisplay} />
        <Route path="/sidebar" component={Sidebar} />
        <Route path="/pdfdisplay" component={PDFDisplay} />
        <Route path="/instructor" component={InstructorPanel} />
        <Route path="/:courseID" component={HomeContainer}>
            <Route path="/:courseID/:lectureNum" component={HomeContainer} />
        </Route>
    </Route>
);
