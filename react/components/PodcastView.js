import React from 'react';
//import { Link } from 'react-router';
import VideoPlayer from './VideoPlayer';
import PDFDisplay from './PDFDisplay';
//import { database } from './../../database/database_init';
//import { Button } from 'react-bootstrap';

const PDF_URL = 'https://firebasestorage.googleapis.com/v0/b/augcast-465ef.appspot.com/o/test%2Fpdf%2F101w17day16.pdf?alt=media&token=b2ba3890-0d38-4722-a24c-740fce01dc0b';
const MEDIA_URL = 'http://techslides.com/demos/sample-videos/small.mp4';

/**
    VideoView - Will contain VideoPlayer
*/
class PodcastView extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
        };
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
                    <PDFDisplay pdfURL={PDF_URL}/>

                </div>

                <div className = "video-view">
                    <VideoPlayer mediaURL={MEDIA_URL}/>
                </div>

            </div>
        );
    }
}

export default PodcastView;
