import React from 'react';
import FA from 'react-fontawesome';
import {database} from '../../../database/database_init';
import {connect} from 'react-redux';


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
        var that = this;

        // get the favorites array, set state for pinned courses
        database.ref('users/'+this.props.username+'/favorites').once('value').then(function(snapshot) {
            let favoriteArray = snapshot.val();

            // course is the index in the array
            for (var course in favoriteArray) {
                if (favoriteArray[course] === that.props.id) {
                    that.setState ({
                        pinned: true
                    });

                    that.props.moveToTop (that.props.id);
                }
            }
        });
    }

    render () {

        let {number, id, section, prof, selectCourse, course} = this.props;

        return (
            <li className="course-item" key={id} >
                <div className="pin-button">
                    <FA onClick={() => {this.pinCourse(id);}}
                        name={(this.state.pinned)?'star':'star-o'}
                        size="2x"
                        className={(this.state.pinned)?'pinned':'unpinned'}/>
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
