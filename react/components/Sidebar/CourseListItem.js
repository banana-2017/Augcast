import React from 'react';
import FA from 'react-fontawesome';
import {connect} from 'react-redux';


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
            <li className="course-item" key={id} >
                <div className="pin-button">
                    <FA onClick={() => {this.pinCourse(id);}}
                        name={(this.props.favorite)?'star':'star-o'}
                        size="2x"
                        className={(this.props.favorite)?'pinned':'unpinned'}/>
                </div>
                <div id="courseLabel" onClick={() => {selectCourse(course);}}>
                    <div className="course-title">
                        <span className="course-number">{number}</span>
                        <span className="course-section">{section}</span>
                    </div>
                    <div className="course-prof">{prof}</div>
                    <div className="expand-button"></div>
                </div>
            </li>
        );
    }
}

function mapStateToProps (state) {
    return {
        username: state.username
    };
}


const CourseListItemContainer = connect(mapStateToProps)(CourseListItem);
export default CourseListItemContainer;
