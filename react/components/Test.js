// Sidebar.js
// Responsible for uploading the PDF

import React from 'react';
import { firebaseApp, storageRef } from './../../database/database_init';
import { ProgressBar, Button, Glyphicon } from 'react-bootstrap';
import Sidebar from './Sidebar.js';
import PodcastView from './PodcastView.js';


class Test extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
    }

    render () {
        return (
            <div className="main">
                <Sidebar />
                <PodcastView />
            </div>
        );
    }
}

export default Test;
