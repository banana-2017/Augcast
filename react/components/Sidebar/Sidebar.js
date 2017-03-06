// Sidebar.js
// Our Navigation Center

import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { database } from './../../../database/database_init';
import Spinner from 'react-spinkit';
import CourseListContainer from './CourseList.js';
import LectureListContainer from './LectureList.js';

class Sidebar extends React.Component {

    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            display: 'loading',
            course: undefined
        };

        // functions
        this.back = this.back.bind(this);
        this.selectCourse = this.selectCourse.bind(this);

        // course slection variable
        this.courses = undefined;

        // database query
        var that = this;
        database.ref('courses').once('value').then(function(snapshot) {
            that.courses = snapshot.val();
            if (that.props.lectureNum == undefined) {
                that.setState({display: 'course'});
            }
        });
    }


    /**
     * Routine before rendering LectureList.
     * Queries database for lecture information regarding selected course.
     */
    componentWillMount() {
        var that = this;
        if (this.props.courseID) {
            database.ref('lectures/' + this.props.courseID).once('value').then(function(snapshot) {
                that.lectures = snapshot.val();
                that.setState({display: that.props.counrseID});
            });
        }
    }


    /**
     * Handler for the back button.
     * Navigate from LectureList back to CoureList
     */
    back() {
        browserHistory.push('/');
        this.setState({display: 'course'});
    }


    /**
     * Handler for the course selection..
     * Display LectureList of the selected course.
     */
    selectCourse(id) {
        console.log("Selecting course: " + id);
        var that = this;
        database.ref('lectures/' + id).once('value').then(function(snapshot) {
            that.lectures = snapshot.val();
            that.setState({display: id});
        });
        browserHistory.push('/' + id);
    }


    render () {
        console.log("Rendering LectureList....");
        console.log(this.props);

        // loading
        if (this.state.display == 'loading') {
            return <Spinner className="sidebar-loading" spinnerName="three-bounce" />;
        }

        // render lecture list
        else if (this.state.display == 'course') {
            return <CourseListContainer courses={this.courses}
                                        onSelectCourse={this.selectCourse} />;
        }
        // render course list
        else {
            return <LectureListContainer back={this.back}
                                         course={this.courses[this.props.courseID]}
                                         lectures={this.lectures} />;
        }
    }

}

function mapStateToProps (state) {
    return {
        currentCourse:  state.currentCourse,
        currentLecture: state.currentLecture
    };
}

function mapDispatchToProps (dispatch) {
    return {
        updateCourseState: (course, lectureNum) => {
            dispatch (updateCourse (course, lectureNum));
        }
    };
}

const SidebarContainer = connect (mapStateToProps)(Sidebar);
export default SidebarContainer;
