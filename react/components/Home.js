// Home.js
// The landing page for our amazing app
import React from 'react';
import {connect} from 'react-redux';
import SidebarContainer from './Sidebar/Sidebar.js';
import PodcastViewContainer from './PodcastView.js';

class Home extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            playing: undefined
        };

        this.selectLecture = this.selectLecture.bind(this);
    }

    selectLecture(lectureID) {
        this.setState({playing: lectureID});
    }

    render () {
        var main = null;
        if (this.props.currentLecture) {
            main = <PodcastViewContainer />;
        } else {
            main = <div className="blank">select lecture to start</div>;
        }

        document.title = 'Augcast';

        return (
            <div>
                <SidebarContainer courseID={this.props.params.courseID}
                                  lectureNum={this.props.params.lectureNum}
                                  selectLecture={this.selectLecture} />
                <div className="main">
                    {main}
                </div>
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        currentLecture: state.currentLecture,
        username:       state.username
    };
}

const HomeContainer = connect(mapStateToProps)(Home);
export default HomeContainer;
