// PDFDisplay.js
// Responsible for displaying the PDF

import React from 'react';
import PDF from 'react-pdf-js';
import { Button } from 'react-bootstrap';
//import { database } from './../../database/database_init';

class PDFDisplay extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            page: 1,
            file: props.pdfURL,
            pages: 1
        };

        // Bind all functions so they can refer to "this" correctly
        this.onDocumentComplete = this.onDocumentComplete.bind(this);
        this.skipToTime = this.skipToTime.bind(this);
    }

    onDocumentComplete(documentLength) {
        this.setState({ pages: documentLength });

    }

    skipToTime(timestamp) {
        console.log('PDFDisplay skipToTime: ' + timestamp);
        this.props.onSkipToTime(timestamp);
    }

    render() {
        var that = this;
        var sentinelArray = Array.from(Array(this.state.pages));
        var PDFpages = sentinelArray.map(function(x, i){
            return (
                <div
                    key={'ButtonPageCombo' + i}
                    >
                    <Button
                        key={'Button' + i}
                        onClick={() => {that.skipToTime(i);}}>
                        Skip to {i}
                    </Button>
                    <br/>
                    <PDF
                        key={'PDFPage' + i}
                        file={that.state.file}
                        onDocumentComplete={that.onDocumentComplete}
                        scale={0.5}
                        page= {i + 1} />
                </div>
            );
        });

        return (
            <div
                style={{
                    textAlign: 'center',
                    margin: '0 auto',
                }}>
                <h2>
                    PDF Viewer
                </h2>
                <div
                    style= {{
                        overflowY: 'auto',
                        height:'600px',
                    }}
                    className="pdf-slides">
                    {PDFpages}
                </div>

            </div>
        );
    }
}

export default PDFDisplay;
