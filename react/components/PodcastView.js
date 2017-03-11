import React from 'react';
import { connect } from 'react-redux';
import VideoPlayer from './VideoPlayer';
import PDFDisplay from './PDFDisplay';
import { database } from './../../database/database_init';
import ElabRequest from './ElabRequest';

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

            // console.log('PodcastView was mounted: ' + JSON.stringify(that.props));
            var ref = database.ref('/lectures/' + course.id + '/' + lecture.id);

            // Listen to changes at ref's location in db
            var pdfRef = ref.on('value', function(snapshot) {
                console.log('POD MOUNT snapshot.val: ' + JSON.stringify(snapshot.val()));
                that.setState({
                    lectureInfo: snapshot.val()
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
            // console.log('PodcastView recieved new props: ' + JSON.stringify(newProps));
            var newRef = database.ref('lectures/' + newProps.currentCourse.id + '/' + newProps.currentLecture.id);

            var pdfRef = newRef.on('value', function(snapshot) {
                console.log('POD PROPS snapshot.val: ' + JSON.stringify(snapshot.val()));

                that.setState({

                    lectureInfo: snapshot.val()
                });

            });

            this.setState({
                firebaseListener: newRef,
                firebaseCallback: pdfRef
            });
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
                    <div className="pdf-panel">
                        {this.props.currentLecture != undefined
                            && this.state.lectureInfo.slides_url != undefined ?
                            <PDFDisplay
                                onSkipToTime={this.handleSkipToTime}
                                timestamps={this.state.lectureInfo.timestamps}
                                pdfURL={this.state.lectureInfo.slides_url}/>
                            : <div></div>}
                    </div>
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
        currentLecture: state.currentLecture
    };
}

const PodcastViewContainer = connect (mapStateToProps)(PodcastView);
export default PodcastViewContainer;
