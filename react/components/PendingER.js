import React from 'react';
import { database } from './../../database/database_init';
import ProgressBar from 'react-toolbox/lib/progress_bar';

import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import {Button} from 'react-toolbox/lib/button';

class PendingER extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ERGroups: [],
            dataRetrieved: false
        }

        // Props
        console.log("Props to PendingER");
        console.log("Course: ", this.props.course);

        // Instance Variable
        this.pendingERs = [];
        this.lectures = [];
        this.counter1 = [];

        this.updateLectures();

        // Bind the function
        this.updateLectures = this.updateLectures.bind(this);
        this.updateERs = this.updateERs.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(JSON.stringify(this.props.course) != JSON.stringify(nextProps)) {
            this.updateLectures();
        }
    }

    updateLectures() {
        // Query database to get the list of lecture ids for this course
        var that = this;
        database.ref('lectures/' + that.props.course.id).once('value').then(function(snapshot) {
            let lectures_temp = [];
            let lectureList = snapshot.val();

            that.counter1 = 1;
            for(var index in lectureList) {
                let lecture = lectureList[index];

                lectures_temp.push(lecture);
                that.updateERs(lecture.id, Object.keys(lectureList).length, that.counter1);
            }

            that.lectures = lectures_temp;
        });
    }

    /*
     * Get the ERs from the elaborations directory
     */
    updateERs(lectureId, totalLecture, counter1) {
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
                        console.log(that.pendingERs);
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

    render() {
        var that = this;

        let ERItem = function(ER) {
            return (
                <div key={ER.key}>
                    <Card style={{width: '%100'}}>
                        <CardTitle
                            title={ER.title}
                            subtitle={"Author: " + ER.author + ER.email}
                        />
                        <CardText>{ER.content}</CardText>
                        <CardActions>
                            <Button label="Answer" />
                            <Button label="Dismiss" />
                        </CardActions>
                    </Card>
                </div>
            )
        };


        let ERGroupItem = function (ERGroup) {
            if(ERGroup != null) {
                let lecture = ERGroup.lecture;
                let group = ERGroup.group;

                if(group == null) {
                    return
                }
                else {
                    return (
                        <div key={ERGroup.id}>
                            <p>{lecture.id + "   Week " + lecture.week + " " + lecture.day}</p>
                            {group.map(ERItem)}
                        </div>
                    )
                }
            }
        };

        return (
            <div key="1">
                {that.state.dataRetrieved ? that.state.ERGroups.map(ERGroupItem) :
                    <ProgressBar type='circular' mode='indeterminate' multicolor />}
            </div>
        );
    }
}

export default PendingER;