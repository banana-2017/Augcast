import React from 'react';
import { Link } from 'react-router';


/**
 Home module - to be displayed on the side
 */
class Home extends React.Component {

    render () {
        return (
            <div>
            <h1>Home</h1>
            <Link to="/test">Open Sidebar (/test)</Link>
            <br/>
            <Link to="/podcastview">Open PodcastView (/podcastview)</Link>
            <br/>
            <Link to="/upload">Open Upload Page (/upload)</Link>
            <br/>
            <Link to="/pdf">Open PDF Display Page (/pdf)</Link>
            <br/>
            <Link to="/elab-request">Open Elab-Request Page</Link>
            </div>
        );
    }
}

export default Home;
