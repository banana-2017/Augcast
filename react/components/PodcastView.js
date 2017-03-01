import React from 'react';
//import { Link } from 'react-router';
import VideoPlayer from './VideoPlayer';
import PDFDisplay from './PDFDisplay';
//import { database } from './../../database/database_init';
//import { Button } from 'react-bootstrap';

const PDF_URL = 'https://firebasestorage.googleapis.com/v0/b/augcast-465ef.appspot.com/o/test%2Fpdf%2F101w17day16.pdf?alt=media&token=b2ba3890-0d38-4722-a24c-740fce01dc0b';
const MEDIA_URL = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';

/**
    VideoView - Will contain VideoPlayer
*/
class PodcastView extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            timestamp: 0
        };

        this.handleSkipToTime = this.handleSkipToTime.bind(this);
        this.lecture = this.props.lecture;
    }

    handleSkipToTime(time) {
        console.log('PodcastView handleSkipToTime: ' + time);
        this.setState({timestamp: time});
    }

    render () {
        console.log(this.lecture);
        return (
            <div className="content-panel">
                <PDFDisplay
                    onSkipToTime={this.handleSkipToTime}
                    pdfURL={PDF_URL}/>

                <div className = "video-panel">
                    <VideoPlayer
                        timestamp={this.state.timestamp}
                        mediaURL={this.lecture.video_url}/>
                </div>
            </div>
        );
    }
}

export default PodcastView;
