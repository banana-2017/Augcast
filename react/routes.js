import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomeContainer from './components/Home';
import Login from './components/Login';
import PodcastView from './components/PodcastView';
import Upload from './components/Upload';
import PDFDisplay from './components/PDFDisplay';
import Test from './components/Test';
import Sidebar from './components/Sidebar/Sidebar';
import appReducers from './redux/reducers';
import ElabRequest from './components/ElabRequest';


// eslint-disable-next-line
import React from 'react';      // used for jsx



module.exports = (
    <Route path="/" component = {App} >
        <IndexRoute component = {HomeContainer} onEnter={authenticate} ></IndexRoute>
        <Route path="/login" component = {Login}/>
        <Route path="/podcastview" component={PodcastView} />
        <Route path="/upload" component = {Upload}/>
        <Route path="/pdf" component={PDFDisplay} />
        <Route path="/test" component={Test} />
        <Route path="/sidebar" component={Sidebar} />
        <Route path="/pdfdisplay" component={PDFDisplay} />
        <Route path="/elab-request" component={ElabRequest} />
        <Route path="/:courseID" component={Test}>
            <Route path="/:courseID/:lectureID" component={Test} />
        </Route>
    </Route>
);
