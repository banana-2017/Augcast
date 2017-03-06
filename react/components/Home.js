// Sidebar.js
// Responsible for uploading the PDF

import React from 'react';
import { connect } from 'react-redux';
import SidebarContainer from './Sidebar/Sidebar.js';
import PodcastViewContainer from './PodcastView.js';

class Home extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            playing: undefined
        }

        this.selectLecture = this.selectLecture.bind(this);
    }

    selectLecture(lectureID) {
        console.log("Changing home state: " + lectureID);
        this.setState({playing: lectureID});
    }

    render () {
        console.log("Rendering Home....");
        console.log(this.state);
        let main = null;
        if (this.state.playing) {
            main = <PodcastViewContainer />
        } else {
            main = <div>select lecture to view content</div>
        }

        return (
            <div className="main">
                <SidebarContainer courseID={this.props.params.courseID}
                                  lectureNum={this.props.params.lectureNum}
                                  selectLecture={this.selectLecture} />
                {main}
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        currentCourse:  state.currentCourse,
        currentLecture: state.currentLecture
    };
}

const HomeContainer = connect (mapStateToProps)(Home);

export default HomeContainer;
