// CourseList.js
// List all podcast-enabled courses

import React from 'react';
import FA from 'react-fontawesome';
import { FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';
import Fuse from 'fuse.js';

import  CourseListItem from './CourseListItem';
import {database} from '../../../database/database_init';


class CourseList extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            visibleCourses: [],    // keys to visible courses
            favoriteArray: []
        };

        this.search = this.search.bind(this);
        this.searchInput = this.searchInput.bind(this);
        this.moveToTop = this.moveToTop.bind (this);
        this.pushToFavorites = this.pushToFavorites.bind (this);
        this.removeFromFavorites = this.removeFromFavorites.bind(this);

        // lecture slection variable
        this.dataArray = [];

        // inherit all course data
        this.courses = this.props.courses;
        this.state.visibleCourses = Object.keys(this.courses);

        // populate array for search
        for (var course in this.courses) {
            let current = this.courses[course];
            current.key = course;
            this.dataArray.push(current);
        }
    }

    componentWillMount () {
        // get the favorites array, set state for pinned courses
        var that = this;

        database.ref('users/'+this.props.username+'/favorites').once('value').then(function(snapshot) {
            let favoriteArray = snapshot.val();

            if (snapshot.val() == null) {
                favoriteArray = [];
            }

            that.setState({favoriteArray:favoriteArray});

            let visibleCourses = that.state.visibleCourses;
            for (var course in visibleCourses) {
                if (favoriteArray.includes(visibleCourses[course])) {
                    that.moveToTop (visibleCourses[course]);
                }
            }
        });
    }

    // search course
    search (query) {
        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 70,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['dept', 'num', 'professor', 'title']
        };

        var fuse = new Fuse(this.dataArray, options);
        var result = fuse.search(query);
        return result;
    }

    searchInput (e) {
        let query = e.target.value;

        // empty query
        if (query === '') {
            this.setState({visibleCourses:this.courseIDs});
            return;
        }

        let searchResults = this.search (query);
        let visibleCourses = [];
        for (var index in searchResults) {
            visibleCourses.push (searchResults[index].key);
        }
        this.setState({visibleCourses:visibleCourses});
    }

    /**************** Pinned course management ******************/

    // adds to favorites in db
    pushToFavorites (courseId) {
        var updates = {};
        let favoriteArray = this.state.favoriteArray;
        favoriteArray.push (courseId);
        this.moveToTop (courseId);

        updates['/users/' + this.props.username + '/favorites'] = favoriteArray;
        this.setState({favoriteArray: favoriteArray});
        database.ref().update(updates);
    }


    // removes from favorties in db
    removeFromFavorites (courseId) {
        var updates = {};
        let favoriteArray = this.state.favoriteArray;

        let index = favoriteArray.indexOf (courseId);
        if (index > -1) {
            favoriteArray.splice (index, 1);
        }

        updates['/users/' + this.props.username + '/favorites'] = favoriteArray;
        this.setState({favoriteArray: favoriteArray});
        database.ref().update(updates);
    }

    // moves pinned courses to the top
    moveToTop (courseId) {
        let visibleCourses = this.state.visibleCourses;
        let index = visibleCourses.indexOf (courseId);

        // removing the courseId and pushing to the front
        if (index > -1) {
            visibleCourses.splice(index, 1);
        }

        visibleCourses.unshift (courseId);
        this.setState ({visibleCourses: visibleCourses});
    }

    /********************************************************************/

    render () {

        // make data accessible in subroutines
        var courses = this.courses;

        // access to this
        var that = this;

        // render single course item
        var listItem = function(id) {
            var course = courses[id];
            var number = course.dept + ' ' + course.num;
            var section = course.section;
            var prof = course.professor;

            if (that.state.favoriteArray.length > 0) {
                var favorite = that.state.favoriteArray.includes(id);
            }

            return (
                <CourseListItem key={id}
                                number={number}
                                id={id}
                                section={section}
                                prof={prof}
                                course={course}
                                selectCourse={that.props.selectCourse}
                                favorite= {favorite}
                                pushToFavorites = {that.pushToFavorites}
                                removeFromFavorites = {that.removeFromFavorites}
                                moveToTop={that.moveToTop}/>
            );
        };

        return (
            <div className="nav">
                <div className="search-bar">
                    <div className="search-icon"><FA name='search' /></div>
                    <FormControl type="text"
                                 placeholder="Filter courses..."
                                 onChange={this.searchInput}
                                 className="search-box" />
                </div>
                <div className="course-wrapper">
                    <ul className="unpinned-list">
                        {this.state.visibleCourses.map(listItem)}
                    </ul>
                </div>
            </div>
        );
    }
}


function mapStateToProps (state) {
    return {
        currentCourse:  state.currentCourse,
        currentLecture: state.currentLecture,
        username: state.username
    };
}

const CourseListContainer = connect (mapStateToProps, null)(CourseList);
export default CourseListContainer;
