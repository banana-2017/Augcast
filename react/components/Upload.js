// Upload.js
// Responsible for uploading the PDF

import React from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import { connect } from 'react-redux';
import Button from 'react-toolbox/lib/button';
import { firebaseApp, storageRef, database } from './../../database/database_init';
import { ProgressBar } from 'react-bootstrap';


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
            this.setState({error: 'The input is not a PDF file!'});
            return;
        }

        // Check if the server is busy with 2 other PDFs right now
        database.ref('/server').once('value').then(function(server_snapshot) {
            if (server_snapshot.val().processCount >= 2) {
                that.setState({
                    error: 'There are 2 PDFs already being processed! \nPlease wait for them to complete and try again, our poor server is working really hard.'
                });
            } else {
                that.setState({
                    error: ''
                });

                that.updateUploadInProgress(true);

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
                    }
                );
            }
        });
    }

    updateUploadInProgress(evt) {
        this.props.handleUploadInProgress(evt);
    }

    callLabelAPI(url) {
        var that = this;

        fetch('http://138.197.233.34/api/label', {
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
                    <input className='pdf-upload'
                            ref='inputBox'
                           type='file'
                           style={{margin:'10px'}}
                           accept='application/pdf'/>
                    <Button className="form-button upload"
                            onClick={this.handleFile} primary raised> Upload </Button>
                    <Button className="form-button clear"
                            disabled={this.state.uploadProgress >= 0}
                            onClick={this.handleClear}> Clear selection </Button>
                    <Button className="form-button close"
                            onClick={this.props.handleClose}> Close </Button>
                </form>

                {this.state.error}
                {this.state.uploadProgress >= 0 ? <ProgressBar
                    active
                    now={this.state.uploadProgress}
                    label=
                        {
                            this.state.uploadProgress != 100 ?
                            (this.state.uploadProgress).toFixed(2) + '%' :
                            'Do not leave this page yet! Fetching video, please wait... (~30 seconds)'
                        }
                     /> : ''}
            </div>
        );
    }

}

class UploadComplete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            downloadURL: '',
            isInstructor: false,
            deleteConfirm: false
        };

        let that = this;

        this.lectureRef = database.ref('lectures/' + this.props.currentCourse.id + '/' + this.props.currentLecture.id);

        // Get the pdfUrl
        this.lectureRef.once('value').then(function(snapshot){
            let lecture = snapshot.val();
            that.setState({downloadURL: lecture.slides_url});
        });

        // Get the user information for instructor validation
        database.ref('users/' + this.props.username + '/instructorFor').once('value').then(function(snapshot) {
            let instructorFor = snapshot.val();
            let isInstructor = instructorFor.includes(that.props.currentCourse.id);
            that.setState({isInstructor: isInstructor});
        });

        this.handleDelete = this.handleDelete.bind(this);
        this.toggleConfirm = this.toggleConfirm.bind(this);
    }

    toggleConfirm() {
        this.setState({deleteConfirm: !this.state.deleteConfirm});
    }

    handleDelete() {
        let updates = {};
        updates['/slides_url'] = null;
        updates['/timestamps'] = null;
        updates['/labelProgress'] = null;
        updates['/contents'] = null;

        this.lectureRef.update(updates);
        this.toggleConfirm();
    }

    render() {
        let that = this;
        var deleteButton = (!this.state.deleteConfirm) ?
            (<Button className="form-button" accent raised
                 onClick={this.toggleConfirm}>
                 Delete PDF file
            </Button>) :
            (<span className="delete-confirm">
                <Button className="form-button" accent raised
                    onClick={this.handleDelete}>
                    Nuke it.
                </Button>
                <Button className="form-button"
                    onClick={this.toggleConfirm}>
                    Nah.
                </Button>
            </span>)
        return (
            <div>
                <h3>PDF Analyzing complete!</h3>
                <div>
                    <span>You can now click on the slides that have timestamps to jump to their occurences in the podcast.</span>
                    <span> <a href={that.state.downloadURL}>Open PDF file</a></span>
                </div>
                {that.state.isInstructor && deleteButton}
                <Button
                    className="form-button close"
                    style={{margin:'10px'}}
                    onClick={this.props.handleClose}>
                    Close
                </Button>
            </div>
        );
    }
}

class DynamicDisplay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // If lectureInfo not loaded yet, do nothing.
        if (this.props.currentLecture == undefined) {
            return (<div>Loading...</div>);
        }

        // If there are timestamps in DB, display a labeling complete message
        if (this.props.currentLecture.timestamps != undefined) {
            return (
                <UploadComplete
                    currentCourse={this.props.currentCourse}
                    currentLecture={this.props.currentLecture}
                    handleClose={this.props.onClose}
                    username={this.props.username}/>
            );
        }

        // If there is labeling progress, display the progress bar
        if (this.props.currentLecture.labelProgress != undefined) {
            return (
                <div>
                    <h3>
                        Analyzing PDF
                    </h3>
                    <br/>
                    <p>
                        Your submitted PDF is being analyzed for matching text in the video podcast.
                        This process will take >40 minutes for a 50-minute lecture,
                        depending on the text content of the podcast.
                        <br />
                        <b>Feel free to browse away and check back later on the progress!</b>
                    </p>
                    <br/>
                    <h4>Progress: </h4>
                    <br/>
                    <ProgressBar
                        active
                        now={this.props.currentLecture.labelProgress}
                        label={`${(this.props.currentLecture.labelProgress).toFixed(2)}%`} />
                    <Button className="form-button close"
                        onClick={this.props.onClose}>
                        Close
                    </Button>
                </div>
            );
        }

        else {
            return (
                <FileUploader currentCourse={this.props.currentCourse}
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


        // No lecture was passed in, do not set up listener
        if (newProps.lecture == undefined) return;

        // Remove old database Listener
        if (this.state.firebaseListener != undefined) {
            this.state.firebaseListener.off('value', this.state.uploadReference);
        }

        // Create and store new listener so it can too be removed
        var that = this;
        var newRef = database.ref('lectures/' + newProps.navCourse.id + '/' + newProps.lecture.id);

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
        if (this.state.firebaseListener != undefined) {
            this.state.firebaseListener.off('value', this.state.firebaseCallback);
        }    }

    handleUploadInProgress(evt) {
        this.setState({
            uploadInProgress: evt
        });
    }

    /**
     * Handler for closing the dialog box.
     */
    handleClose() {
        console.log('requested close');
        if (!this.state.uploadInProgress) this.props.close();
    }

    render () {
        // var title = this.props.navCourse.dept + ' '
        //           + this.props.navCourse.num + ' ' + this.prop.navCourse.section;
        // if (this.props.currentLecture) {
        //     title += ' (' + this.props.currentLecture.day + ', Week ' + this.props.currentLecture.week;
        // }
        // console.log(title);
        // if (this.props.currentLecture.timestamps != undefined) {
        //     title = "
        //
        return (
            <div>
                <Dialog title="Upload a PDF file"
                        modal={false}
                        active={this.props.open}
                        onOverlayMouseDown={this.handleClose}
                        onRequestClose={this.handleClose} >

                    <DynamicDisplay
                        currentCourse={this.props.navCourse}
                        currentLecture={this.state.lectureInfo}
                        username={this.props.username}
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
        currentLecture:  state.currentLecture,
        navCourse: state.navCourse
    };
}

const UploadContainer = connect (mapStateToProps, null)(Upload);
export default UploadContainer;
