// PDFDisplay.js
// Responsible for displaying the PDF

import React from 'react';
import PDF from 'react-pdf-js';
import { database } from './../../database/database_init';

//import { ProgressBar, Button, Glyphicon } from 'react-bootstrap';

//const PDFSource = 'https://firebasestorage.googleapis.com/v0/b/augcast-465ef.appspot.com/o/test%2Fpdf%2FCSE105Homework15.pdf?alt=media&token=9216ecf4-26f6-4a14-8095-b8a2ee1bb9d7';

class PDFDisplay extends React.Component {

    constructor(props) {
        super(props);
        var that = this;

        // Initial state
        this.state = {
            page: 1,
            file: props.pdfURL,
            pages: 2
        };

        database.ref('/test/time').once('value').then(function(snapshot) {
            that.refs.basicvideo.currentTime = Number(snapshot.val());
            that.state.url = snapshot.val();
        });



        // Bind all functions so they can refer to "this" correctly
        this.onDocumentComplete = this.onDocumentComplete.bind(this);
        this.onPageComplete = this.onPageComplete.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handleNext = this.handleNext.bind(this);

    }

    /**
     * Upload the inputted file to Firebase Storage.
     */
    onDocumentComplete(pages) {
        console.log('Triggered onDocumentComplete(): ' + JSON.stringify((JSON.parse(pages))));
        //this.setState({ page: pages });
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

                <h1
                    style={{margin:'10px'}}>
                    PDF Viewer
                </h1>
                Viewing
                <br/> {this.state.file} <br/>
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
