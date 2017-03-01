// PDFDisplay.js
// Responsible for displaying the PDF

import React from 'react';
import PDF from 'react-pdf-js';
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
                <div key={'ButtonPageCombo' + i} className="pdf-page" onClick={() => {that.skipToTime(i);}}>
                    <div className="pdf-timestamp">{i}</div>
                    <PDF
                        key={'PDFPage' + i}
                        file={that.state.file}
                        onDocumentComplete={that.onDocumentComplete}
                        scale={0.3}
                        page= {i + 1} />
                </div>
            );
        });

        return (
            <div
                className="pdf-panel">
                {PDFpages}
            </div>
        );
    }
}

export default PDFDisplay;
