// Sidebar.js
// Responsible for uploading the PDF

import React from 'react';
import Sidebar from './Sidebar/Sidebar.js';
import PodcastView from './PodcastView.js';


class Test extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
    }

    render () {
        return (
            <div className="main">
                <Sidebar courseID={this.props.params.courseID}
                         lectureNum={this.props.params.lectureNum}/>
            </div>
        );
    }
}

export default Test;
