import React from 'react';
import Button from './../button/Button';
import { Link } from 'react-router';
var firebase = require('firebase/app');
require('firebase/database');
var conf = require('./../../../database/credentials.json');
var config = {
    apiKey: conf.apiKey,
    authDomain: conf.authDomain,
    databaseURL: conf.databaseURL,
    storageBucket: conf.storageBucket
};

// Log in to Firebase if not logged in
if (firebase.apps.length === 0) {
    firebase.initializeApp(config);
}

firebase.database().ref('test').update({
    time: 6
});





//import { default as Video, Controls, Overlay } from 'react-html5video';


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
        curRate += 0.1;
        this.setState({
            playbackRate: curRate,
            status: 'Increased playback rate to ' + curRate
        });
        this.refs.basicvideo.playbackRate = curRate;
    }

    decreasePlaybackRate() {
        var curRate = this.state.playbackRate;
        curRate -= 0.1;
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
        var that = this;
        firebase.database().ref('/test/time').once('value').then(function(snapshot) {
            that.refs.basicvideo.currentTime = Number(snapshot.val());
            that.setState({
                status: 'fetched value from db, seeking playhead to ' + snapshot.val()
            });
        });
    }

    render () {
        return (
            <div>
                <div className="video_player_container">
                    <h1>Video page</h1>
                    <Link to="/">Back home</Link>
                    <br />
                    <video
                        src="http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_60fps_normal.mp4"
                        width="560"
                        id="basicvideo"
                        ref="basicvideo"
                        controls>
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="video_api_container">
                    <h2 className="main__h2">Video API</h2>
                    <h3 className="main__h2">Current status: {this.state.status}</h3>
                        <ul className="main__ul">
                            <li>
                                <Button onClick={this.togglePlay}>Play/Pause</Button>
                            </li>
                            <li>
                                Playback rate:
                                <Button onClick={this.decreasePlaybackRate}>-</Button>
                                 {this.state.playbackRate.toFixed(1)}x
                                <Button onClick={this.increasePlaybackRate}>+</Button>
                            </li>
                            <li>
                                Skip to time (seconds):
                                <input onChange={this.updateCurTime}/>
                            </li>
                            <li>
                                Skip to time from Firebase: test/time:
                                <Button onClick={this.updateCurTimeFromDB}>Update</Button>
                            </li>
                        </ul>
                </div>
            </div>
        );
    }
}

export default VideoPlayer;
