// Upload.js
// Responsible for uploading the PDF

import React from 'react';
import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import { firebaseApp, storageRef, database } from './../../database/database_init';
import { ProgressBar, Button, Glyphicon } from 'react-bootstrap';


class FileUploader extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            uploadProgress: -1,
            downloadURL: '',
            error: '',
            APIresult: ''
        };

        this.handleFile = this.handleFile.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.callLabelAPI = this.callLabelAPI.bind(this);
        this.updateUploadInProgress = this.updateUploadInProgress.bind(this);
    }

    /**
     * Upload the inputted file to Firebase Storage.
     */
    handleFile() {
        let that = this;

        // The inputted file
        var file = this.refs.inputBox.files[0];

        // Ignore click if no file chosen
        if (file === undefined) {
            return;
        }

        // Check for .pdf extension. Weak method of checking filetype, but it's
        // the best we can do in the front end.
        if (!file.name.endsWith('.pdf')) {
            console.log('This is not a PDF file');
            this.setState({error: 'The input is not a PDF file!'});
            return;
        }

        console.log('User inputted file:' + file.name);
        this.setState({
            error: ''
        });

        this.updateUploadInProgress(true);

        // Declare file to be PDF
        var metadata = {
            contentType: 'application/pdf'
        };
        // Upload the file and metadata to 'lectureid/file.pdf' in FB Storage
        var uploadTask = storageRef.child(that.props.currentLecture.id + '/' + file.name).put(file, metadata);


        // Listener for state changes, errors, and completion of the upload
        uploadTask.on(firebaseApp.storage.TaskEvent.STATE_CHANGED,
            function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                that.setState({
                    uploadProgress: progress
                });
                // Get upload progress
            }, function (error) {
                // Handle errors in upload
                console.log('Error in FBS upload: ' + error.code);
            }, function () {
                // Upload successful, get download URL
                console.log('Upload successful!');
                var url = uploadTask.snapshot.downloadURL;
                that.setState({
                    downloadURL: url,
                    error: ''
                });

                that.updateUploadInProgress(false);

                database.ref('lectures/' + that.props.currentCourse.id + '/' + that.props.currentLecture.id).update({
                    slides_url: url
                });

                // Call the label API with the new download URL
                that.callLabelAPI(url);
            });

    }

    updateUploadInProgress(evt) {
        this.props.handleUploadInProgress(evt);
    }

    callLabelAPI(url) {
        var that = this;

        fetch('http://localhost:8080/api/label', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pdfURL: url,
                courseID: that.props.currentCourse.id,
                lectureID: that.props.currentLecture.id,
                mediaURL: that.props.currentLecture.video_url
            })
        }).then(function(response) {
            return response.json();
        }).then(function(j) {
            that.setState({APIresult: j.message});
        });
    }

    handleClear() {
        this.refs.inputForm.reset();
        this.setState({
            uploadProgress: 0,
            uploadStarted: false,
            downloadURL: '',
            error: ''
        });
    }

    render() {
        return (
            <div>
                <p>
                    There are no slides for this lecture yet.
                    Upload the PDF here for the system to automatically generate
                    timestamps for each slide!
                </p>
                <form
                    ref='inputForm'>
                <input
                    ref='inputBox'
                    type='file'
                    style={{margin:'10px'}}
                    accept='application/pdf'/>
                <Button
                    bsStyle="default"
                    bsSize="small"
                    disabled={this.state.uploadProgress >= 0}
                    style={{margin:'10px'}}
                    onClick={this.props.handleClose}>
                        Close
                </Button>
                <Button
                    bsStyle="warning"
                    bsSize="small"
                    style={{margin:'10px'}}
                    onClick={this.handleClear}>
                        Clear selection
                </Button>
                <Button
                    bsStyle="success"
                    bsSize="small"
                    style={{margin:'10px'}}
                    onClick={this.handleFile}>
                        <Glyphicon glyph="cloud-upload" />
                        Upload
                </Button>
                </form>
                {this.state.error}
                {this.state.uploadProgress >= 0 ? <ProgressBar
                    active
                    now={this.state.uploadProgress}
                    label={`${(this.state.uploadProgress).toFixed(2)}%`} /> : ''}
            </div>
        );
    }

}

class DynamicDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('rendering dynamic display');
        // If lectureInfo not loaded yet, do nothing.
        if (this.props.currentLecture == undefined) {
            return (<div>Loading...</div>);
        }

        // If there are timestamps in DB, display a labeling complete message
        if (this.props.currentLecture.timestamps != undefined) {
            return (<div>Labeling complete!</div>);
        }

        // If there is labeling progress, display the progress bar
        if (this.props.currentLecture.labelProgress != undefined) {
            return (
                <div>
                    <h3>
                        Analyzing PDF
                    </h3>
                    <br/>
                    <p>Your submitted PDF is being analyzed for matching text in the video podcast.
                        This process will take around 20 minutes, feel free to browse away and check back later on the progress.</p>
                    <br/>
                    <h4>Progress: </h4>
                    <br/>
                    <ProgressBar
                        active
                        now={this.props.currentLecture.labelProgress}
                        label={`${(this.props.currentLecture.labelProgress).toFixed(2)}%`} />
                </div>

            );
        }

        else {
            return (
                <FileUploader
                currentCourse={this.props.currentCourse}
                currentLecture={this.props.currentLecture}
                handleUploadInProgress={this.props.onUploadInProgress}
                handleClose={this.props.onClose}/>
            );
        }
    }

}

class Upload extends React.Component {

    constructor(props) {
        super(props);
        console.log('CONSTRUCTOR');

        // Initial state
        this.state = {
            uploadProgress: 0,
            uploadStarted: false,
            downloadURL: '',
            error: '',
            APIresult: '',
            lectureID: '',
            open: false
        };

        // Bind all functions so they can refer to "this" correctly
        //this.togglePlay = this.togglePlay.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleUploadInProgress = this.handleUploadInProgress.bind(this);
    }

    componentDidMount() {

        // No lecture was passed in, do not set up listener
        if (this.props.lecture == undefined) return;

        var that = this;
        var course = this.props.navCourse;
        var lecture = this.props.lecture;


        var ref = database.ref('/lectures/' + course.id + '/' + lecture.id);

        // Listen to changes at ref's location in db
        var uploadReference = ref.on('value', function(snapshot) {
            console.log('db on: ' + lecture.id);
            that.setState({
                lectureInfo: snapshot.val()
            });
        });

        // Store reference to database listener so it can be later removed
        this.setState({
            firebaseListener: ref,
            firebaseCallback: uploadReference
        });

    }

    componentWillReceiveProps(newProps) {
        // Remove old database Listener

        // No lecture was passed in, do not set up listener
        if (newProps.lecture == undefined) return;

        if (this.state.firebaseListener != undefined) {
            this.state.firebaseListener.off('value', this.state.uploadReference);
        }

        // Create and store new listener so it can too be removed
        var that = this;
        // console.log('PodcastView recieved new props: ' + JSON.stringify(newProps));
        var newRef = database.ref('lectures/' + newProps.navCourse.id + '/' + newProps.lecture.id);

        console.log('received props, db on: ' + newProps.lecture.id);
        var uploadReference = newRef.on('value', function(snapshot) {
            that.setState({
                lectureInfo: snapshot.val()
            });
        });

        this.setState({
            firebaseListener: newRef,
            firebaseCallback: uploadReference
        });
    }

    // Destructor, removes database listener when component is unmounted
    componentWillUnmount() {
        //Remove the database listener
        this.state.firebaseListener.off('value', this.state.firebaseCallback);
    }

    handleUploadInProgress(evt) {
        this.setState({
            uploadInProgress: evt
        });
    }

    /**
     * Handler for closing the dialog box.
     */
    handleClose() {
        if (!this.state.uploadInProgress) this.props.close();
    }

    render () {
        return (
            <div>
                <Dialog title="Upload a PDF file"
                        modal={false}
                        open={this.props.open}
                        onRequestClose={this.handleClose} >

                    <DynamicDisplay
                        currentCourse={this.props.navCourse}
                        currentLecture={this.state.lectureInfo}
                        onClose={this.handleClose}
                        onUploadInProgress={this.handleUploadInProgress}/>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        currentCourse:  state.currentCourse,
        currentLecture:  state.currentLecture
    };
}

const UploadContainer = connect (mapStateToProps, null)(Upload);
export default UploadContainer;
