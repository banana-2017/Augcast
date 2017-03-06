import React from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';


/**
 Home module - to be displayed on the side
 */
class Home extends React.Component {

    render () {
        return (
            <div>
            <h1>Welcome {this.props.username}</h1>
            <Link to="/test">Open Sidebar (/test)</Link>
            <br/>
            <Link to="/podcastview">Open PodcastView (/podcastview)</Link>
            <br/>
            <Link to="/upload">Open Upload Page (/upload)</Link>
            <br/>
            <Link to="/pdf">Open PDF Display Page (/pdf)</Link>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        username: state.username
    };
}

const HomeContainer = connect(mapStateToProps)(Home);
export default HomeContainer;
