// Upload.js
// Responsible for uploading the PDF

import React from 'react';

class Upload extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            curSource: 1
        };

        // Bind all functions so they can refer to "this" correctly
        //this.togglePlay = this.togglePlay.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    render () {
        return (
            <div>
            </div>
        );
    }
}

export default Upload;
