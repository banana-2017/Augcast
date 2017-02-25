import React from 'react';
import { database } from './../../database/database_init';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

const SKIP_VALUE = 10;

/**
VideoPlayer - to be displayed on the side
*/
class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            playbackRate: 1,
            status: 'Initialized',
            playing: true
        };

        // Bind all functions so they can refer to "this" correctly
        this.togglePlay = this.togglePlay.bind(this);
        this.increasePlaybackRate = this.increasePlaybackRate.bind(this);
        this.decreasePlaybackRate = this.decreasePlaybackRate.bind(this);
        this.updateCurTime = this.updateCurTime.bind(this);
        this.updateCurTimeFromDB = this.updateCurTimeFromDB.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        this.refs.basicvideo.currentTime = nextProps.timestamp;
    }

    togglePlay() {
        var vid = this.refs.basicvideo;
        if (vid.paused) {
            vid.play();
            this.setState({
                playing: true
            });
        } else {
            vid.pause();
            this.setState({
                playing: false
            });
        }
    }

    increasePlaybackRate() {
        var curRate = this.state.playbackRate;
        // Add upper limit 2.0
        if (curRate < 2.0) curRate += 0.05;
        this.setState({
            playbackRate: curRate,
            status: 'Increased playback rate to ' + curRate
        });
        this.refs.basicvideo.playbackRate = curRate;
    }

    decreasePlaybackRate() {
        var curRate = this.state.playbackRate;

        if (curRate > 0) curRate -= 0.05;

        this.setState({
            playbackRate: curRate,
            status: 'Decreased playback rate to ' + curRate
        });
        this.refs.basicvideo.playbackRate = curRate;
    }

    updateCurTime(evt) {
        var numberStatus = !isNaN(evt.target.value) ? evt.target.value : 'That isnt even a number yo';
        this.setState({
            status: 'Seeking playhead to ' + numberStatus
        });
        this.refs.basicvideo.currentTime = Number(evt.target.value);
    }

    updateCurTimeFromDB() {
        var that = this;    // Maintain current "this" in Firebase callback

        // Fetch value from db and set currentTime
        database.ref('/test/time').once('value').then(function(snapshot) {
            that.refs.basicvideo.currentTime = Number(snapshot.val());
            that.setState({
                status: 'fetched value from db, seeking playhead to ' + snapshot.val()
            });
        });
    }

    render () {
        return (
            <div
                style={{
                    textAlign: 'center',
                    margin: '0 auto',
                    width: '560px',
                }} >
                <h2> CSE 110 Lecture A00 (Fri Mar 10)</h2>
                <div
                    className="video_player_container">

                    <br />
                    <video
                        src={this.props.mediaURL}
                        autoPlay
                        width="600"
                        muted
                        id="basicvideo"
                        ref="basicvideo"
                        controls>
                        Your browser does not support the video tag.
                    </video>
                    <div
                        className="video_api_container">
                        <ButtonGroup>
                            <Button bsStyle="default"  onClick={() => {this.refs.basicvideo.currentTime -= SKIP_VALUE;}}><Glyphicon glyph="chevron-left" />Skip {SKIP_VALUE}s</Button>
                            <Button
                                bsStyle="primary"
                                onClick={this.togglePlay}>
                                    {!this.state.playing ?
                                        <div><Glyphicon glyph="play" /> Play</div>  :
                                        <div><Glyphicon glyph="pause" /> Pause</div>
                                    }
                            </Button>

                            <Button bsStyle="default"  onClick={() => {this.refs.basicvideo.currentTime += SKIP_VALUE;}}>Skip {SKIP_VALUE}s <Glyphicon glyph="chevron-right" /></Button>
                        </ButtonGroup>

                        <br />

                        <Button style={{margin:'10px'}} bsStyle="default" bsSize="small" onClick={this.decreasePlaybackRate}><Glyphicon glyph="chevron-left" /></Button>
                        Speed: {Math.abs(this.state.playbackRate).toFixed(2)}x
                        <Button style={{margin:'10px'}} bsStyle="default" bsSize="small" onClick={this.increasePlaybackRate}><Glyphicon glyph="chevron-right" /></Button>

                        <br />

                        <h4 className="main__h2">Timestamp: {this.props.timestamp}</h4>

                    </div>
                </div>

            </div>
        );
    }
}

export default VideoPlayer;
