// Lecture.js
// List all lectures of podcast-enabled courses

import React from 'react';
import {connect} from 'react-redux';
import { browserHistory } from 'react-router';
import { FormControl } from 'react-bootstrap';
import UploadContainer from '../Upload';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { database } from './../../../database/database_init';

// ui components
import ActionCached from 'material-ui/svg-icons/action/cached';
import Button from 'react-toolbox/lib/button';
import Drawer from 'material-ui/Drawer';
import FA from 'react-fontawesome';
import IconButton from 'material-ui/IconButton';
// import Tooltip from 'react-toolbox/lib/tooltip';
import {MenuItem} from 'react-toolbox/lib/menu';
import SearchResultList from './SearchResultList';

//import PodcastView from '../PodcastView.js';
import { displayLecture } from '../../redux/actions';
import Fuse from 'fuse.js';

injectTapEventPlugin();

// const TooltipButton = Tooltip(Button);

class UploadButton extends React.Component {
    constructor(props) {
        super(props);

        // initial states
        this.state = {};
    }

    render() {
        var that = this;
        return (
            <div className="slides-status">
            <Button icon='cloud_upload' className="upload-button"
                    onClick={() => {that.props.onClick(that.props.iconLecture);}} />
            </div>
        );
    }
}

class DoneMark extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="slides-status">
                <Button icon="done" />
            </div>
        );
    }
}

class LabelingProgressChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var that = this;
        return (
            <div className="slides-status">
                <IconButton
                    tooltip={'Progress: ' + that.props.progress}
                    onTouchTap={() => {that.props.onClick(that.props.iconLecture);}}>
                    <ActionCached />
                </IconButton>
            </div>
        );
    }
}

class UploadIconController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // Store reference to database listener so it can be removed
        var that = this;
        var course = this.props.iconCourse;
        var lecture = this.props.iconLecture;

        if (course != undefined && lecture != undefined) {

            var ref = database.ref('/lectures/' + course.id + '/' + lecture.id);

            // Listen to changes at ref's location in db
            var iconRef = ref.on('value', function(snapshot) {
                that.setState({
                    lectureInfo: snapshot.val()
                });
            });

            this.setState({
                firebaseListener: ref,
                firebaseCallback: iconRef
            });

        }
    }

    componentWillReceiveProps(newProps) {

        // Remove old database Listener
        if (this.state.firebaseListener != undefined) {
            this.state.firebaseListener.off('value', this.state.firebaseCallback);
        }

        // Create and store new listener so it can too be removed
        var that = this;
        var newRef = database.ref('lectures/' + newProps.iconCourse.id + '/' + newProps.iconLecture.id);

        var iconRef = newRef.on('value', function(snapshot) {
            that.setState({
                lectureInfo: snapshot.val()
            });
        });

        this.setState({
            firebaseListener: newRef,
            firebaseCallback: iconRef
        });

    }

    // Destructor, removes database listener when component is unmounted
    componentWillUnmount() {
        //Remove the database listener
        if (this.state.firebaseListener != undefined) {
            this.state.firebaseListener.off('value', this.state.firebaseCallback);
        }    }

    render() {

        // If lecture info not loaded from DB just chill out
        if (this.state.lectureInfo == undefined) {
            return (<div></div>);
        }

        // If there are timestamps in DB, display check mark
        if (this.state.lectureInfo.timestamps != undefined) {
            return (<DoneMark/>);
        }

        // If there is progress in the database, display a progress pie chart
        if (this.state.lectureInfo.labelProgress != undefined) {
            return (
                <LabelingProgressChart
                    onClick={this.props.uploadButtonOnClick}
                    iconLecture={this.props.iconLecture}
                    progress={this.state.lectureInfo.labelProgress}/>
            );
        }

        // If no progress, then display upload Button
        return (
            <UploadButton
                onClick={this.props.uploadButtonOnClick}
                iconLecture={this.props.iconLecture}/>
        );
    }
}

class LectureList extends React.Component {
    constructor(props) {
        super(props);

        // Initial state
        this.state = {
            render: (this.props.currentLecture) ? this.props.currentLecture.id : undefined,
            lectures: [],
            upload: undefined,
            modal: false,
            visibleLectures: [],
            resultArray: [],
            query: ''
        };

        // decide if week has changed in randering lecture list
        this.week = null;

        // inherit all course data
        this.course = this.props.navCourse;
        this.searchInput = this.searchInput.bind(this);

        // helper object
        this.calendar = {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
            7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
            'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday',
            'Thu': 'Thursday', 'Fri': 'Friday', 'Sat': 'Saturday', 'Sun': 'Sunday'
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount () {

        let course = this.props.navCourse.id;
        var that = this;

        this.setState ({visibleLectures: this.props.navCourse.lectures});

        // getting array of lectures of this course
        database.ref('/lectures/' + course).once('value').then(function(snapshot) {
            let lectureList = snapshot.val();
            let searchData = [];

            for (var lecture  in lectureList) {
                var i = 0;
                for (var slide in lectureList[lecture].contents) {
                    searchData.push ({
                        index: i,
                        lectureId: lecture,
                        slide: slide,
                        contents: lectureList[lecture].contents[slide]
                    });
                    i++;
                }
            }

            that.setState ({lectures: searchData});
        });
    }

    selectLecture(lecture) {
        this.props.displayLecture(this.course, lecture);
        browserHistory.push('/' + this.course.id + '/' + lecture.num);
    }

    searchInput (e) {
        let query = e.target.value;

        if (query === '') {
            this.setState ({ visibleLectures: this.props.navCourse.lectures, resultArray: []});
            return;
        }
        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 70,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ['contents']
        };

        var fuse = new Fuse(this.state.lectures, options);
        var result = fuse.search(query);

        let visibleLectures = [];
        let resultArray = {};
        for (var lecture in result) {
            if (visibleLectures.indexOf(result[lecture].lectureId) < 0) {
                visibleLectures.push (result[lecture].lectureId);
                resultArray[result[lecture].lectureId] = [];
            }

            // storing the search results in an object
            resultArray[result[lecture].lectureId].push (
                result[lecture]
            );
        }

        this.setState (
            {visibleLectures: visibleLectures,
                resultArray: resultArray,
                query: query});

        this.week = null;
        return result;
    }

    openModal(lecture) {
        this.setState({upload: lecture, modal: true});
    }

    closeModal() {
        this.setState({upload: undefined, modal: false});
    }

    render () {
        // access to this
        var that = this;

        var listItem = function(lectureID) {
            var lecture = that.props.lectures[lectureID];
            var month = that.calendar[lecture.month];

            var weekSeparator = null;
            if (that.week != lecture.week) {
                that.week = lecture.week;
                weekSeparator = (<div className="week-separator">Week {lecture.week}</div>);
            }

            return (
                <div className="lecture-wrapper" key={lecture.id}>
                    {weekSeparator}
                    <MenuItem className={(that.props.currentLecture && lecture.id == that.props.currentLecture.id) ? 'lecture-item selected' : 'lecture-item'}>
                        <div className="lecture-button" onClick={() => {that.selectLecture(lecture);}}>
                            <div className="lecture-calendar">
                                <div className="lecture-month">{month}</div>
                                <div className="lecture-date">{lecture.date}</div>
                            </div>
                            <div className="lecture-info">
                                <span className="lecture-day">{that.calendar[lecture.day]}</span>
                            </div>
                        </div>
                        <UploadIconController uploadButtonOnClick={that.openModal} iconLecture={lecture} iconCourse={that.props.navCourse}/>
                    </MenuItem>
                    <SearchResultList resultList= {that.state.resultArray[lecture.id]} query = {that.state.query} lecture={lecture}/>
                </div>
            );
        };

        // Set page title
        document.title = this.course.dept + ' ' + this.course.num + ' - Augcast';


        return (
            <div className="sidebar">
                <Drawer className="sidebar-drawer">
                    <div className="search-bar">
                        <div className="search-icon"><FA name='arrow-left' onClick={that.props.back}/></div>
                        <FormControl type="text"
                                     placeholder={'Search ' + this.course.dept + ' ' + this.course.num + '...'}
                                     onChange={this.searchInput}
                                     className="search-box" />
                    </div>
                    <div className="lectures-wrapper">
                        <div className="lecture-list">
                            {that.state.visibleLectures.map(listItem)}
                        </div>
                    </div>
                </Drawer>
                <UploadContainer lecture={this.state.upload} open={this.state.modal} close={this.closeModal}/>
            </div>
        );
    }
}


function mapStateToProps (state) {
    return {
        navCourse:  state.navCourse,
        currentLecture:  state.currentLecture,
        currentCourse: state.currentCourse
    };
}

function mapDispatchToProps (dispatch) {
    return {
        displayLecture: (currentCourse, currentLecture) => {
            dispatch (displayLecture(currentCourse, currentLecture));
        }

    };
}

const LectureListContainer = connect (mapStateToProps, mapDispatchToProps)(LectureList);
export default LectureListContainer;
