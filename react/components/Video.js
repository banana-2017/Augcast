import React from 'react';
import { Link } from 'react-router';
import Video from 'react-html5video';


/**
Home module - to be displayed on the side
*/
class VideoPlayer extends React.Component {

    render () {
        return (
            <div>
            <h1>Video page!</h1>
            <Link to="/">Back home</Link>

            <Video autoPlay controls loop muted
            poster="http://myndset.com/wp-content/uploads/2015/10/podcast-image.jpg"
            onCanPlayThrough={() => {
                console.log('Video player ready');
            }}>
            <source src="https://podcast.ucsd.edu/Podcasts//bibc120_wi17/bibc120_wi17-02162017-1230.mp4" type="video/mp4" />
            </Video>

            </div>
        );
    }
}

export default VideoPlayer;
