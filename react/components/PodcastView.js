import React from 'react';
//import { Link } from 'react-router';
import VideoPlayer from './VideoPlayer';
import PDFDisplay from './PDFDisplay';
import Upload from './Upload';
import { database } from './../../database/database_init';
import { ProgressBar } from 'react-bootstrap';

/**
    VideoView - Will contain VideoPlayer
*/
class PodcastView extends React.Component {

    constructor(props) {
        super(props);

        console.log('lecture prop: ' + JSON.stringify(this.props.lecture));

        // Initial state
        this.state = {
            lectureInfo : {
                timestampProgress: undefined,
                timestamps: undefined,
                pdf_url: undefined
            }
        };

        //var that = this;

        // Update the state whenever this lecture is updated in DB by python script

        this.handleSkipToTime = this.handleSkipToTime.bind(this);
        this.PDFContainer = this.PDFContainer.bind(this);
    }

    handleSkipToTime(time) {
        console.log('PodcastView handleSkipToTime: ' + time);
        this.setState({timestamp: time});
    }


    // Displays either a progress bar if timestamping is in progress,
    // the timestamped PDF if timestamping is complete,
    // or an upload component if no PDF has been submitted yet.
    PDFContainer() {
        var that = this;
        database.ref('lectures/' + this.props.lectureID).on('value', function(snapshot) {
            console.log('db on lectures');
            that.setState({
                lectureInfo: snapshot.val()
            });
        });
        // If there are timestamps in DB, display the PDF with them
        if (this.state.lectureInfo.timestamps != undefined && this.state.lectureInfo.slides_url != undefined) {
            return (
                <PDFDisplay
                    onSkipToTime={this.handleSkipToTime}
                    timestamps={this.state.lectureInfo.timestamps}
                    pdfURL={this.state.pdf_url}/>
            );
        }

        // If there aren't timestamps in DB, then display a progress bar
        else if (this.state.timestampProgress != undefined) {
            return (
                <div>
                    <h3>Your submitted PDF is being analyzed for matching text in the video podcast.
                        This process will take around 20 minutes, feel free to browse away and check back later on the progress.
                    </h3>
                    <br/>
                    <h4>Progress: </h4>
                    <br/>
                    <ProgressBar
                        active
                        now={this.state.timestampProgress}
                        label={`${(this.state.timestampProgress).toFixed(2)}%`} />
                </div>
            );
        }

        // If there isn't any PDF being processed for this lecture, render upload component
        else if (this.state.timestampProgress == undefined) {
            return (
                <Upload/>
            );
        }
    }

    render () {

        return (
            <div className="content-panel">
                <div className="pdf-panel">
                    <this.PDFContainer/>
                </div>
                <div className = "video-panel">
                    <VideoPlayer
                        timestamp={this.state.timestamp}
                        mediaURL={this.props.lecture == undefined ? undefined : this.props.lecture.video_url}/>
                </div>
            </div>
        );
    }
}

export default PodcastView;
