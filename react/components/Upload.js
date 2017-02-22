// Upload.js
// Responsible for uploading the PDF

import React from 'react';
import { firebaseApp, storageRef } from './../../database/database_init';
import { ProgressBar, Button, Glyphicon } from 'react-bootstrap';


class Upload extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            uploadProgress: 0,
            downloadURL: ''
        };

        // Bind all functions so they can refer to "this" correctly
        //this.togglePlay = this.togglePlay.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleClear = this.handleClear.bind(this);

    }

    /**
     * Upload the inputted file to Firebase Storage.
     */
    handleFile() {
        let that = this;
        var file = this.refs.inputBox.value='';

        console.log('User inputted file:' + file.name);

        // Declare file to be PDF
        var metadata = {
            contentType: 'application/pdf'
        };
        // Upload the file and metadata to pdf/filename path in FB Storage
        var uploadTask = storageRef.child('test/pdf/' + file.name).put(file, metadata);

        // Listener for state changes, errors, and completion of the upload
        uploadTask.on(firebaseApp.storage.TaskEvent.STATE_CHANGED,
            function(snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
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
                    downloadURL: url
                });
                console.log('Download URL: ' + url);
            });

    }

    handleClear() {
        this.refs.inputForm.reset();
    }

    render () {
        return (
            <div
            style={{maxWidth: '500px'}}>

                <h1> Upload a file </h1>
                <form
                ref='inputForm'
                >
                <input
                ref='inputBox'
                type='file'
                accept='application/pdf'
                />
                <br/>

                <Button
                    bsStyle="default"
                    bsSize="small"
                    style={{margin:'10px'}}
                    active={this.state.curSource == 2}
                    onClick={this.handleClear}>
                        Remove
                </Button>
                <Button
                    bsStyle="success"
                    bsSize="small"
                    style={{margin:'10px'}}
                    active={this.state.curSource == 2}
                    onClick={this.handleFile}>
                        <Glyphicon glyph="cloud-upload" />
                        Upload
                </Button>
                </form>

                <ProgressBar
                active
                now={this.state.uploadProgress}
                label={`${(this.state.uploadProgress).toFixed(2)}%`} />

                <h3> Download URL from Firebase: </h3>
                <h4> {this.state.downloadURL} </h4>
            </div>
        );
    }
}

export default Upload;
