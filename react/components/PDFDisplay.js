// PDFDisplay.js
// Responsible for displaying the PDF

import React from 'react';
import { storageRef } from './../../database/database_init';
import { ProgressBar, Button, Glyphicon } from 'react-bootstrap';


class PDFDisplay extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {

        };

        // Bind all functions so they can refer to "this" correctly
        this.handleFile = this.handleFile.bind(this);

    }

    /**
     * Upload the inputted file to Firebase Storage.
     */
    handleFile() {
    }


    render () {
        return (
            <div
            style={{maxWidth: '500px', margin:'0 auto'}}>

                <h1
                    style={{margin:'10px'}}>
                    PDF Viewer
                </h1>

            </div>
        );
    }
}

export default PDFDisplay;
