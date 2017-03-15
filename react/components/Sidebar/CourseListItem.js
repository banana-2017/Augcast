import React from 'react';
import {connect} from 'react-redux';
import {MenuItem} from 'react-toolbox/lib/menu';

// ui elements
import FA from 'react-fontawesome';


// render single course item
class CourseListItem extends React.Component {

    constructor (props) {
        super (props);
        this.pinCourse = this.pinCourse.bind(this);
    }

    // toggle pinning
    pinCourse (id) {
        let {favorite, pushToFavorites, removeFromFavorites} = this.props;

        // toggle
        if (favorite)
        {
            removeFromFavorites (id);
        }
        else {
            pushToFavorites (id);
        }
    }

    render () {

        let {number, id, section, prof, selectCourse, course} = this.props;

        return (
            <MenuItem className={ (course == this.props.currentCourse) ? 'course-item selected' : 'course-item' }
                      key={id}>
                <div className="pin-button">
                    <FA onClick={() => {this.pinCourse(id);}}
                        name={(this.props.favorite) ? 'star' : 'star-o'}
                        className={(this.props.favorite) ? 'pinned': ' unpinned'}/>
                </div>
                <div className="course-button" onClick={() => {selectCourse(course);}}>
                    <div className="course-title">
                        <span className="course-number">{number}</span>
                        <span className="course-section">{section}</span>
                    </div>
                    <div className="course-prof">{prof}</div>
                </div>
            </MenuItem>
        );
    }
}

function mapStateToProps (state) {
    return {
        username: state.username,
        currentCourse: state.currentCourse
    };
}


const CourseListItemContainer = connect(mapStateToProps)(CourseListItem);
export default CourseListItemContainer;
