import React from 'react';
import { Link } from 'react-router';
import VideoPlayer from './VideoPlayer';
import PDFDisplay from './PDFDisplay';
//import { database } from './../../database/database_init';
//import { Button } from 'react-bootstrap';

/**
    VideoView - Will contain VideoPlayer
*/
class PodcastView extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            mediaURL: 'http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_60fps_normal.mp4',
            curSource: 1
        };

        // Bind all functions so they can refer to "this" correctly
        //this.togglePlay = this.togglePlay.bind(this);
        this.handleSource1 = this.handleSource1.bind(this);
        this.handleSource2 = this.handleSource2.bind(this);
    }

    handleSource1() {
        this.setState({
            curSource: 1,
            mediaURL: 'http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_60fps_normal.mp4'
        });
    }

    handleSource2() {
        this.setState({
            curSource: 2,
            mediaURL: 'http://techslides.com/demos/sample-videos/small.mp4'
        });
    }

    render () {
        return (
            <div
                className="podcast-container">

                <div className="pdf-view"
                    style={{
                        textAlign: 'center',
                        margin: '0 auto',
                        height: '100%'
                    }}>
                    <h3>Source Controller</h3>
                    <Link to="/">Back home</Link>
                    <br />

                    <PDFDisplay lectureID={'CSE 12  LE A00 LE1'}/>

                </div>

                <div className = "video-view">
                    <VideoPlayer lectureIDL={'CSE 12  LE A00 LE1'}/>
                </div>

            </div>
        );
    }
}

export default PodcastView;
