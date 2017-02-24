import React from 'react';
import { Link } from 'react-router';
import VideoPlayer from './VideoPlayer';
import PDFDisplay from './PDFDisplay';
//import { database } from './../../database/database_init';
//import { Button } from 'react-bootstrap';

const PDF_URL = 'https://firebasestorage.googleapis.com/v0/b/augcast-465ef.appspot.com/o/test%2Fpdf%2FCSE105Homework15.pdf?alt=media&token=9216ecf4-26f6-4a14-8095-b8a2ee1bb9d7';
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
                    <Link to="/">Back home</Link>
                    <br />

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
