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
    }

    onDocumentComplete(length) {
        this.setState({ pages: length });

    }

    render() {
        var that = this;
        var sentinelArray = Array.from(Array(this.state.pages));
        var PDFpages = sentinelArray.map(function(x, i){
            return (
                <PDF
                    key={i}
                    file={that.state.file}
                    onDocumentComplete={that.onDocumentComplete}
                    scale={0.5}
                    page= {i + 1} />
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
                Viewing
                <br/> {this.state.file} <br/>
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
