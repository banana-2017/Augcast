// Sidebar.js
// Our Navigation Center

import React from 'react';
import { connect } from 'react-redux';
import { navigateCourse } from '../../redux/actions';
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
            that.setState({display: 'course'});
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
                that.props.updateCourseState(that.courses[that.props.courseID], null);
            });
        }
    }


    /**
     * Handler for the back button.
     * Navigate from LectureList back to CoureList
     */
    back() {
        browserHistory.push('/');
        this.props.navigateCourse(null);
    }


    /**
     * Handler for the course selection..
     * Display LectureList of the selected course.
     */
    selectCourse(course) {
        var that = this;
        database.ref('lectures/' + course.id).once('value').then(function(snapshot) {
            that.lectures = snapshot.val();
            browserHistory.push('/' + course.id);
            that.props.navigateCourse(course);
        });
    }


    render () {
        // loading
        if (this.state.display == 'loading') {
            return <Spinner className="sidebar-loading" spinnerName="three-bounce" />;
        }

        // render lecture list
        else if (this.props.navCourse) {
            return <LectureListContainer back={this.back}
                                         lectures={this.lectures} />;
        }
        // render course list
        else {
            return <CourseListContainer courses={this.courses}
                                        selectCourse={this.selectCourse} />;
        }
    }

}

function mapStateToProps (state) {
    return {
        navCourse:  state.navCourse
    };
}

function mapDispatchToProps (dispatch) {
    return {
        navigateCourse: (navCourse) => {
            dispatch(navigateCourse(navCourse));
        },
        displayLecture: (currentCourse, currentLecture) => {
            dispatch(displayLecture(currentCourse, currentLecture));
        }
    };
}

const SidebarContainer = connect (mapStateToProps, mapDispatchToProps)(Sidebar);
export default SidebarContainer;
