import React from 'react';
import { database } from './../../database/database_init';
import { connect } from 'react-redux';
import { displayLecture } from '../redux/actions';
import { browserHistory } from 'react-router';

import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import {Button} from 'react-toolbox/lib/button';
import ProgressBar from 'react-toolbox/lib/progress_bar';

class PendingER extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ERGroups: [],
            dataRetrieved: false
        }


        // Instance Variable
        this.pendingERs = [];

        this.elaborationsObj = {};
        this.lecturesObj = {};
        this.lecturesArray = [];

        var that = this;
        database.ref('lectures/' + that.props.course.id).once('value').then(function(snapshot) {
            that.lecturesObj = snapshot.val();
            database.ref('elaborations/' + that.props.course.id).once('value').then(function(snapshot){
                that.elaborationsObj = snapshot.val();

                that.update();
                that.setState({dataRetrieved: true});
            });
        });

        // Bind the function
        this.navigateER = this.navigateER.bind(this);
        this.update = this.update.bind(this);
    }

    // lecturesArray                 timestampsArray    ERsArray
    // [{lecture: lectureObj, timestamps: [{time: time, ERs: [ERs, ...]}, ...], ...]
    update() {
        for(let lecture_key in this.elaborationsObj) {

            let timestampsArray = []
            for(let timestamp_key in this.elaborationsObj[lecture_key]) {

                let ERsArray = [];
                for(let ER in this.elaborationsObj[lecture_key][timestamp_key]) {
                    ERsArray.push(this.elaborationsObj[lecture_key][timestamp_key][ER]);
                }

                let timestamp = {time: timestamp_key, ERs: ERsArray};
                timestampsArray.push(timestamp);
            }

            let lecture = {detail: this.lecturesObj[lecture_key], timestamps: timestampsArray}
            this.lecturesArray.push(lecture);
        }
    }

    navigateER(lecture) {
        console.log(lecture);
        this.props.displayLecture(this.props.course, lecture);
        browserHistory.push('/' + this.props.course.id + '/' + lecture.num);
    }


    render() {
        var that = this;

        let ERItem = function(ER, lecture) {
            return (
                <div key={ER.content}>
                    <Card style={{width: '%100'}}>
                        <CardTitle
                            title={ER.title}
                            subtitle={"Author: " + ER.author + ER.email}
                        />
                        <CardText>{ER.content}</CardText>
                        <CardActions>
                            <Button label="Answer" onClick={()=>{
                                that.props.handleToggle();
                                that.navigateER(lecture);
                            }}/>
                            <Button label="Dismiss" />
                        </CardActions>
                    </Card>
                </div>
            )
        };

        let timestampItem = function(timestamp, lecture) {
            let time = timestamp.time;
            let ERs = timestamp.ERs;

            return (
                <div key={time}>
                    <p>{"At time " + time}</p>
                    {ERs.map( function(x) { return ERItem(x, lecture) } )}
                </div>
            )
        }

        let lectureItem = function (lecture) {
            if(lecture != null) {
                // lecture detail
                let lectureObj = lecture.detail;
                let lectureId = lectureObj.id;
                let week = lectureObj.week;
                let day = lectureObj.day;

                // timestamps
                let timestamps = lecture.timestamps;

                if(timestamps == null) {
                    return
                }
                else {
                    return (
                        <div key={lectureId}>
                            <p>{lectureId + "   Week " + week + " " + day}</p>
                            {timestamps.map( function(x) { return timestampItem(x, lectureObj); } )}
                        </div>
                    )
                }
            }
        };

        return (
            <div>
                {that.state.dataRetrieved ? that.lecturesArray.map(lectureItem) :
                    <ProgressBar type='circular' mode='indeterminate' multicolor />}
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
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

const PendingERContainer = connect (mapStateToProps, mapDispatchToProps)(PendingER);
export default PendingERContainer;

/*
    updateLectures(course) {
        // Query database to get the list of lecture ids for this.elaborationsObj
        var that = this;
        database.ref('lectures/' + course.id).once('value').then(function(snapshot) {
            let lectureList = snapshot.val();
            that.lectures = Object.values(lectureList);

            for(var i = 0; i < that.lectures.length; i++) {
                that.updateERs(that.lectures[i].id, Object.keys(lectureList).length)
            }

        });
    }

    updateERs(lectureId, totalLecture) {
        var that = this;

        database.ref('elaborations/' + lectureId).once('value').then(function(snapshot) {
            let pendingERs_temp = [];

            if (snapshot.val() == null) {
                that.pendingERs.push(null);
            }
            else {
                let counter = 1;
                snapshot.forEach(function (childSnapShot) {
                    if (childSnapShot.hasChild("answers") == false) {
                        let pendingER = childSnapShot.val();
                        pendingERs_temp.push(pendingER);
                    }

                    // use a counter to know whether the callbacks have finished or not
                    if (counter == Object.keys(snapshot.val()).length) {
                        that.pendingERs.push(pendingERs_temp);
                    }
                    counter++;
                });
            }

            if (that.counter1 == totalLecture) {
                let ERGroups_temp = [];
                for(var i = 0; i < that.lectures.length; i++) {
                    let current = {};
                    current.lecture = that.lectures[i];
                    current.group = that.pendingERs[i];
                    current.id = i;
                    ERGroups_temp.push(current);
                }

                that.setState({dataRetrieved: true, ERGroups: ERGroups_temp});
            }
            that.counter1++;

        });
    }
    */
