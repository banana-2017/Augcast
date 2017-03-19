import React from 'react';
import { connect } from 'react-redux';

import VideoPlayer from './VideoPlayer';
import PDFDisplay from './PDFDisplay';
import {updateJumpSlide} from '../redux/actions';
import { database } from './../../database/database_init';

/**
    VideoView - Will contain VideoPlayer
*/
class PodcastView extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            firebaseListener: undefined,
            lectureInfo : {
                labelProgress: undefined,
                timestamps: undefined,
                pdf_url: undefined
            }
        };

        //var that = this;

        // Update the state whenever this lecture is updated in DB by python script

        this.handleSkipToTime = this.handleSkipToTime.bind(this);
    }

    // This method is called only once, right after this component is created.
    // We create a new database listener here so we our state changes Whenever
    // something at our specified location in db changes.
    componentDidMount() {
        // Store reference to database listener so it can be removed
        var that = this;
        var course = this.props.currentCourse;
        var lecture = this.props.currentLecture;

        if (course != undefined && lecture != undefined) {

            var ref = database.ref('/lectures/' + course.id + '/' + lecture.id);

            // Listen to changes at ref's location in db
            var pdfRef = ref.on('value', function(snapshot) {
                that.setState({
                    lectureInfo: snapshot.val()
                },
                function () {
                    let {lectureInfo} = that.state;
                    if (that.props.jumpSlide !== undefined) {
                        that.setState ({
                            timestamp: lectureInfo.timestamps[that.props.jumpSlide]
                        });
                    }
                });
            });

            this.setState({
                firebaseListener: ref,
                firebaseCallback: pdfRef
            });


        } else {
            this.setState({
                firstRender: true
            });
        }

    }

    // This method is called whenever the props are updated (i.e. a new lecture is selected in Sidebar)
    // It will remove the old database listener and add one for the new lecture
    componentWillReceiveProps(newProps) {

        // Only change the database listener if the lectureID has changed
        if (this.state.firstRender || (newProps.currentLecture.id != this.props.currentLecture.id)) {

            if (this.state.firstRender) {
                this.setState({
                    firstRender: false
                });
            }

            // Remove old database Listener
            if (this.state.firebaseListener != undefined) {
                this.state.firebaseListener.off('value', this.state.firebaseCallback);
            }

            // Create and store new listener so it can too be removed
            var that = this;
            var newRef = database.ref('lectures/' + newProps.currentCourse.id + '/' + newProps.currentLecture.id);

            var pdfRef = newRef.on('value', function(snapshot) {
                let lectureInfo = snapshot.val();
                let timestamp = undefined;

                if (newProps.jumpSlide !== undefined && lectureInfo.timestamps !== undefined) {
                    timestamp = lectureInfo.timestamps[newProps.jumpSlide];
                }

                that.setState({
                    lectureInfo: snapshot.val(),
                    timestamp: timestamp
                }, () => {
                    that.setState ({
                        timestamp: undefined
                    });
                    that.props.updateJumpSlide (undefined);
                });

            });

            this.setState({
                firebaseListener: newRef,
                firebaseCallback: pdfRef
            });
        }

        else {
            // if jumpSlide is updated, update timestamp
            let {lectureInfo} = this.state;
            if (newProps.jumpSlide !== undefined && lectureInfo.timestamps !== undefined) {
                let timestamp = lectureInfo.timestamps[newProps.jumpSlide];
                this.setState ({
                    timestamp: timestamp
                }, () => {
                    this.setState ({
                        timestamp: undefined
                    });
                    this.props.updateJumpSlide (undefined);
                });
            }
        }
    }

    // Destructor, removes database listener when component is unmounted
    componentWillUnmount() {
        //Remove the database listener
        if (this.state.firebaseListener != undefined) {
            this.state.firebaseListener.off('value', this.state.firebaseCallback);
        }
    }

    // Callback function passed to and executed by VideoPlayer
    handleSkipToTime(time) {
        this.setState({timestamp: time});
    }

    render () {
        if (this.props.currentLecture == undefined) {
            return (<div>select a lecture to start</div>);
        } else {
            document.title = this.props.currentCourse.dept + ' '
                           + this.props.currentCourse.num  + ': Lecture '
                           + this.props.currentLecture.num
                           + ' - Augcast';

            return (
                <div className="content-panel">
                    {this.props.currentLecture != undefined && this.state.lectureInfo.slides_url != undefined ?
                        <div className="pdf-panel">
                            <PDFDisplay
                                onSkipToTime={this.handleSkipToTime}
                                timestamps={this.state.lectureInfo.timestamps}
                                pdfURL={this.state.lectureInfo.slides_url} />
                        </div> :
                        <div></div>}
                    <div className = "video-panel">
                        <VideoPlayer timestamp={this.state.timestamp} />
                    </div>
                </div>
            );
        }
    }
}


function mapStateToProps (state) {
    return {
        currentCourse:  state.currentCourse,
        currentLecture: state.currentLecture,
        jumpSlide: state.jumpSlide
    };
}

function mapDispatchToProps (dispatch) {
    return {
        updateJumpSlide : (slide) => {
            dispatch (updateJumpSlide(slide));
        }
    };
}

const PodcastViewContainer = connect (mapStateToProps, mapDispatchToProps)(PodcastView);
export default PodcastViewContainer;
