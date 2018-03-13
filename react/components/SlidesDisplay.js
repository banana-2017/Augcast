import React from 'react';

class SlidesDisplay extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            page: 1,
            pages: 1
        };

        // Bind all functions so they can refer to "this" correctly
        this.skipToTime = this.skipToTime.bind(this);
    }

    skipToTime(timestamp) {
        if (timestamp >= 0) {
            this.props.onSkipToTime(timestamp);
        }
    }

    prettyTimestamp(timestamp) {
        var minutes = parseInt(timestamp / 60);
        var seconds = timestamp % 60;
        if (seconds < 10) seconds = '0' + seconds;
        if (minutes < 10) minutes = '0' + minutes;
        return minutes + ':' + seconds;
    }

    render() {
        var that = this;
        var slides = this.props.slidesURLs.map(function(slide, i){
            var j = i + 1;
            var stamp = that.props.timestamps != undefined ?
                that.props.timestamps[i] :
                undefined;
            return (
                <div
                key={'ButtonSlideCombo' + i}
                className={(that.props.timestamps != undefined && !isNaN(stamp) && stamp != -1) ? 'slide-page' : 'slide-page slide-unclickable'}
                onClick={() => {that.skipToTime(stamp);}}>
                    {(that.props.timestamps != undefined && !isNaN(stamp) && stamp != -1) ?
                        <div className="slide-timestamp">{'Slide ' + j + ' (Skip to ' + that.prettyTimestamp(stamp) + ')'}</div>
                            : <div></div>}

                    <img
                    src={slide}
                    key={'Slide' + i}
                    className={'slide-img'}/>

                </div>
            );
        });

        return (
            <div className="slide-pages">{slides}</div>
        );
    }

}

export default SlidesDisplay;
