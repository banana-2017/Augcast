// PDFDisplay.js
// Responsible for displaying the PDF

//const isBrowser = typeof window !== 'undefined';
//const PDF = isBrowser ? require('react-pdf-js') : undefined;
import React from 'react';
//import PDF from 'react-pdf-js';
//import { ProgressBar, Button, Glyphicon } from 'react-bootstrap';

const CORSProxy = 'http://cors-anywhere.herokuapp.com/';
const PDFSource = 'https://firebasestorage.googleapis.com/v0/b/augcast-465ef.appspot.com/o/test%2Fpdf%2FCSE105Homework15.pdf?alt=media&token=9216ecf4-26f6-4a14-8095-b8a2ee1bb9d7';

class PDFDisplay extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            page: 1,
            file: CORSProxy + PDFSource,
            pages: 2
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
    onDocumentComplete() {
        console.log('Triggered onDocumentComplete()');
        this.setState({ page: 1 });
    }

    onPageComplete() {
        console.log('Triggered onPageComplete()');
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
        let pagination = null;
        if (this.state.pages) {
            pagination = this.renderPagination(this.state.page, this.state.pages);
        }
        const PDF = require('react-pdf-js');
        return (
            <div
                style={{maxWidth: '500px', margin:'0 auto'}}>

                <h1
                    style={{margin:'10px'}}>
                    PDF Viewer
                </h1>
                Viewing
                <br/> {PDFSource} <br/>
                Through CORS proxy
                {pagination}
                <PDF
                    file={this.state.file}
                    onDocumentComplete={this.onDocumentComplete}
                    onPageComplete={this.onPageComplete}
                    page={this.state.page} />
                {pagination}
            </div>
        );
    }
}

export default PDFDisplay;
