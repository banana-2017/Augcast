import React from 'react';
import { Link } from 'react-router';
import VideoPlayer from './VideoPlayer';
//import { database } from './../../database/database_init';
//import { Button, Glyphicon } from 'react-bootstrap';

/**
    VideoView - Will contain VideoPlayer
*/
class VideoView extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {

        };

        // Bind all functions so they can refer to "this" correctly
        //this.togglePlay = this.togglePlay.bind(this);
    }

    render () {
        return (
            <div>
                <div className="header">
                    <h1>Video page</h1>
                    <Link to="/">Back home</Link>
                    <br />
                </div>
                <VideoPlayer />
            </div>
        );
    }
}

export default VideoView;
