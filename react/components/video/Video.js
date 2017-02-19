import React from 'react';
import Button from './../button/Button';
import { Link } from 'react-router';
import { default as Video, Controls, Overlay } from 'react-html5video';


/**
VideoPlayer - to be displayed on the side
*/
var VideoPlayer = React.createClass ({

    togglePlay() {
        this.refs.video.togglePlay();
    },

    render () {
        return (
            <div>
                <div>
                    <h1>Video page!</h1>
                    <Link to="/">Back home</Link>

                    <video
                        src="http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_60fps_normal.mp4"
                        width="320"
                        ref="video"
                        controls>
                        Your browser does not support the video tag.
                    </video>


                    <Video
                        className="custom-class"
                        controls
                        autoPlay
                        loop
                        muted
                        width="560">
                        <source src="https://podcast.ucsd.edu/Podcasts//bibc120_wi17/bibc120_wi17-02162017-1230.mp4" type="video/mp4" />
                    </Video>

                </div>

                <div className="column">
                    <button onClick={() => this.togglePlay}>Play/Pause</button>
                    <h2 className="main__h2">Video API</h2>
                        <ul className="main__ul">
                            <li>
                                <Button onClick={this.togglePlay}>togglePlay</Button>
                            </li>
                            <li>
                                <Button onClick={this.seek}>seek</Button>
                                <input className="main__input" defaultValue="30" ref={(c) => this._seekInput = c} type="number" min="0" max="30" step="1" />
                            </li>

                        </ul>
                </div>
            </div>
        );
    }
});

export default VideoPlayer;
