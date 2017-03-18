import React from 'react';
import { database } from './../../database/database_init';
import {ButtonGroup} from 'react-bootstrap';
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

        // helper object
        this.calendar = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
            'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday',
            'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday'
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('Recieving prop timestamp: ' + JSON.stringify(nextProps.timestamp));

        if (nextProps.timestamp == undefined ||
            isNaN(nextProps.timestamp) ||
            nextProps.timestamp < 0) {

            alert('No timestamp for this slide! Can\'t jump to time.');
            return;
        }

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
        console.log('evt.target.value == ' + evt.target.value);
        if (evt.target.value == undefined ||
            isNan(evt.target.value) ||
            evt.target.value < 0) {

            alert('No timestamp for this slide! Can\'t jump to time.');
            return;
        }

        this.refs.basicvideo.currentTime = Number(evt.target.value);
    }

    render () {
        console.log(this.props);
        var course = this.props.currentCourse;
        var lecture = this.props.currentLecture;
        var video_url = lecture.video_url;
        return (
            <div className="video-wrapper">
                <div className="video-container">
                    <video src={video_url} autoPlay width="600"
                           id="basicvideo" ref="basicvideo" controls>
                            Your browser does not support the video tag.
                    </video>
                    <div className="video-button-group-container">
                        <ButtonGroup className='video-button-group'>
                            <FA className="rewind video-control-button" name="backward"
                                onClick={() => {this.refs.basicvideo.currentTime -= SKIP_VALUE;}}/>
                            <FA className="toggle-play video-control-button" name={this.state.playing ? 'pause' : 'play'}
                                onClick={this.togglePlay}/>
                            <FA className="fastforward video-control-button" name="forward"
                                onClick={() => {this.refs.basicvideo.currentTime += SKIP_VALUE;}}/>
                            <FA className="speed-up video-control-button" name="minus"
                                onClick={this.decreasePlaybackRate} />
                            <span className="current-speed">Speed: {Math.abs(this.state.playbackRate).toFixed(2)}x</span>
                            <FA className="speed-up video-control-button" name="plus"
                                onClick={this.increasePlaybackRate} />
                        </ButtonGroup>
                    </div>
                </div>
                <div className="info-container">
                    <div className="info-meta">
                        <div className="info-lecture">{course.dept} {course.num}: {course.subject} ({course.section})</div>
                        <div className="info-date">Week {lecture.week}, {this.calendar[lecture.day]}, {this.calendar[lecture.month]} {lecture.date}</div>
                    </div>
                    <hr/>
                    <ElabRequest timestamp={this.props.timestamp} lecture={this.props.currentLecture.id}
                                 course={this.props.currentCourse.id} />
                </div>
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
