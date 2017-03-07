import React from 'react';
import FA from 'react-fontawesome';


// render single course item
class CourseListItem extends React.Component {

    constructor (props) {
        super (props);

        this.pinCourse = this.pinCourse.bind(this);
        this.state = {
            pinned: false
        };
    }

    pinCourse (id) {
        return id;
    }

    componentWillMount () {

    }

    render () {

        let {number, id, section, prof, selectCourse, course} = this.props;

        return (
            <li className="course-item" key={id} onClick={() => {selectCourse(course);}}>
                <div className="pin-button"><FA onClick={() => {this.pinCourse(id);}} name="star-o" size="2x"/></div>
                <div className="course-title">
                    <span className="course-number">{number}</span>
                    <span className="course-section">{section}</span>
                </div>
                <div className="course-prof">{prof}</div>
                <div className="expand-button"></div>
            </li>
        );
    }
}


export default CourseListItem;
