import React from 'react';
import { database } from './../../database/database_init';
import { Button, Glyphicon } from 'react-bootstrap';


/**
VideoPlayer - to be displayed on the side
*/
class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            playbackRate: 1,
            status: 'Initialized'
        };

        // Bind all functions so they can refer to "this" correctly
        this.togglePlay = this.togglePlay.bind(this);
        this.increasePlaybackRate = this.increasePlaybackRate.bind(this);
        this.decreasePlaybackRate = this.decreasePlaybackRate.bind(this);
        this.updateCurTime = this.updateCurTime.bind(this);
        this.updateCurTimeFromDB = this.updateCurTimeFromDB.bind(this);
    }

    togglePlay() {
        var vid = this.refs.basicvideo;
        if (vid.paused) vid.play();
        else vid.pause();

        this.setState({
            status: 'Toggled play/pause'
        });
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
        console.log('Writing to DB complete');
        return (
            <div>
                <div className="video_player_container">

                    <br />
                    <video
                        src={this.props.mediaURL}
                        autoPlay
                        width="560"
                        style={{margin:'10px'}}
                        id="basicvideo"
                        ref="basicvideo"
                        controls>
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="video_api_container">
                    <h3 className="main__h3">Video Controls</h3>
                    <h4 className="main__h2">Current status: {this.state.status}</h4>
                        <ul className="main__ul">
                            <li>
                                <Button
                                    bsStyle="primary"
                                    onClick={this.togglePlay}>
                                        <Glyphicon glyph="play" />
                                        <Glyphicon glyph="pause" />
                                        Play/Pause
                                </Button>
                            </li>
                            <li>
                                Playback rate:
                                <Button style={{margin:'10px'}} bsStyle="default" bsSize="small" onClick={this.decreasePlaybackRate}>-</Button>
                                 {Math.abs(this.state.playbackRate).toFixed(2)}x
                                <Button style={{margin:'10px'}} bsStyle="default" bsSize="small" onClick={this.increasePlaybackRate}>+</Button>
                            </li>
                            <li>
                                Skip to time (seconds):
                                <input onChange={this.updateCurTime}/>
                            </li>
                            <li>
                                Skip to time from Firebase path "test/time":
                                <Button style={{margin:'10px'}} bsStyle="success" onClick={this.updateCurTimeFromDB}><Glyphicon glyph="cloud-download" /> Update</Button>
                            </li>
                        </ul>
                </div>
            </div>
        );
    }
}

export default VideoPlayer;
