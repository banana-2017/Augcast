import React from 'react';
import { Link } from 'react-router';
import VideoPlayer from './VideoPlayer';
//import { database } from './../../database/database_init';
import { Button } from 'react-bootstrap';

/**
    VideoView - Will contain VideoPlayer
*/
class VideoView extends React.Component {

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
            <div>
                <div className="columns">

                    <div
                        style = {{
                            float: 'left',
                            padding: '20px',
                            margin: '20px',
                            clear: 'right',
                            height: '600px',
                            borderStyle: 'solid',
                            borderWidth: '2px',
                            borderColor: 'gray'
                        }}>
                        <h1>Source Controller</h1>
                        <Link to="/">Back home</Link>
                        <br />

                        <Button
                            bsStyle="default"
                            bsSize="large"
                            style={{margin:'10px'}}
                            active={this.state.curSource == 1}
                            onClick={this.handleSource1}>
                                Load Source 1
                        </Button>
                        <br />
                        <Button
                            bsStyle="default"
                            bsSize="large"
                            style={{margin:'10px'}}
                            active={this.state.curSource == 2}
                            onClick={this.handleSource2}>
                                Load Source 2
                        </Button>

                    </div>

                    <div style = {{
                        padding: '20px',
                        margin: '20px',

                    }}>
                        <VideoPlayer mediaURL={this.state.mediaURL}/>
                    </div>

                </div>
            </div>
        );
    }
}

export default VideoView;
