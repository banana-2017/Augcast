import React from 'react';
import Button from './../button/Button';
import { Link } from 'react-router';
//import { default as Video, Controls, Overlay } from 'react-html5video';


/**
VideoPlayer - to be displayed on the side
*/
class VideoPlayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playbackRate: 1
        };

        this.togglePlay = this.togglePlay.bind(this);
        this.increasePlaybackRate = this.increasePlaybackRate.bind(this);
    }

    togglePlay() {
        var vid = this.refs.basicvideo;
        if (vid.paused) vid.play();
        else vid.pause();
    }

    increasePlaybackRate() {
        var curRate = this.state.playbackRate;
        curRate++;
        this.setState({playbackRate: curRate});
        this.refs.basicvideo.playbackRate = curRate;

    }

    render () {
        return (
            <div>
                <div>
                    <h1>Video page!</h1>
                    <Link to="/">Back home</Link>
                    <br />
                    <video
                        src="http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_60fps_normal.mp4"
                        width="560"
                        id="basicvideo"
                        ref="basicvideo"
                        autoPlay
                        controls>
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="column">
                    <h2 className="main__h2">Video API</h2>
                        <ul className="main__ul">
                            <li>
                                <Button onClick={this.togglePlay}>Play/Pause</Button>
                            </li>
                            <li>
                                <Button onClick={this.increasePlaybackRate}>Increase Speed</Button>
                                Current speed: {this.state.playbackRate}x
                            </li>
                        </ul>
                </div>
            </div>
        );
    }
}

export default VideoPlayer;
