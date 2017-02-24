// PDFDisplay.js
// Responsible for displaying the PDF

import React from 'react';
import PDF from 'react-pdf-js';
import { database } from './../../database/database_init';

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
        this.onPageComplete = this.onPageComplete.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);

    }

    /**
     * Upload the inputted file to Firebase Storage.
     */
    onDocumentComplete(length) {
        console.log('Triggered onDocumentComplete(): ' + JSON.stringify((JSON.parse(length))));
        this.setState({ pages: length });

    }

    onPageComplete(page) {
        console.log('Triggered onPageComplete()' + JSON.stringify((JSON.parse(page))));
        //this.setState({ page: 1, pages: '' });
    }

    handlePrevious() {
        this.setState({ page: this.state.page - 1 });
    }

    handleNext() {
        this.setState({ page: this.state.page + 1 });
    }

    renderPagination(page, pages) {
        let previousButton =
        <li
            className="previous"
            onClick={this.handlePrevious}>
            <a href="#">
                <i className="fa fa-arrow-left"></i> Previous
            </a>
        </li>;
        if (page === 1) {
            previousButton = <li className="previous disabled"><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
        }
        let nextButton = <li className="next" onClick={this.handleNext}><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
        if (page === pages) {
            nextButton = <li className="next disabled"><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
        }
        return (
            <nav>
                <ul className="pager">
                    {previousButton}
                    {nextButton}
                </ul>
            </nav>
        );
    }

    render() {
        var that = this;
        var sentinelArray = Array.apply(null, Array(this.state.pages)).map(function () {});
        var PDFpages = sentinelArray.map(function(x, i){
            return (
                <PDF
                    key={i}
                    file={that.state.file}
                    onDocumentComplete={that.onDocumentComplete}
                    onPageComplete={that.onPageComplete}
                    scale={0.5}
                    page= {i + 1} />
            );
        });

        let pagination = null;
        if (this.state.pages) {
            pagination = this.renderPagination(this.state.page, this.state.pages);
        }
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
                        height:'400px',
                    }}
                    className="pdf-slides">
                    {PDFpages}
                </div>

            </div>
        );
    }
}

export default PDFDisplay;
