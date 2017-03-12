import React from 'react';
import { database } from './../../database/database_init';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import ElabRequest from './ElabRequest';

// ui components
import FA from 'react-fontawesome';

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
        console.log('Recieving prop timestamp: ' + JSON.stringify(nextProps.timestamp));
        if (nextProps.timestamp != undefined) {
            this.refs.basicvideo.currentTime = nextProps.timestamp;
        }
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
        console.log(this.props);
        var course = this.props.currentCourse;
        var lecture = this.props.currentLecture;
        var lectureNum = lecture.num;
        var video_url = lecture.video_url;
        return (
            <div className="video-wrapper">
                <h2>{course.dept} {course.num} Lecture {lectureNum}, {lecture.month}/{lecture.date}</h2>
                <div className="video-container">
                    <video src={video_url} autoPlay width="600" muted
                           id="basicvideo" ref="basicvideo" controls>
                            Your browser does not support the video tag.
                    </video>
                    <div className="video-button-group-container">
                        <ButtonGroup className='video-button-group'>
                            <FA className="rewind video-control-button" name="backward"
                                onClick={() => {this.refs.basicvideo.currentTime -= SKIP_VALUE;}}/>
                            <FA className="toggle-play video-control-button" name={this.state.playing ? "pause" : "play"}
                                onClick={this.togglePlay}/>
                            <FA className="fastforward video-control-button" name="forward"
                                onClick={() => {this.refs.basicvideo.currentTime += SKIP_VALUE;}}/>
                            <FA className="speed-up video-control-button" name="minus"
                                onClick={this.decreasePlaybackRate} />
                            <span className="current-speed">Speed: {Math.abs(this.state.playbackRate).toFixed(2)}x</span>
                            <FA className="speed-up video-control-button" name="plus"
                                onClick={this.increasePlaybackRate} />
                        </ButtonGroup>

                        <h4 className="main__h2">Timestamp: {this.props.timestamp}</h4>

                    </div>
                </div>
                <ElabRequest timestamp={this.props.timestamp} lecture={this.props.currentLecture.id}
                course={this.props.currentCourse.id} />
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        currentCourse:  state.currentCourse,
        currentLecture: state.currentLecture
    };
}

const VideoPlayerContainer = connect (mapStateToProps)(VideoPlayer);
export default VideoPlayerContainer;
