import React from 'react';
import { database } from './../../database/database_init';

class PendingER extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataRetrieved: false,
            pendingER: []
        }

        // Instance Variable
        this.courseId = this.props.course.id;
        this.lectureIds = [];

        var that = this;
        database.ref('lectures/' + that.courseId).once('value').then(function(snapshot) {
            var lecturesObj = snapshot.val();

            for(var index in lecturesObj) {
                let lecture = lecturesObj[index];
                that.lectureIds.push(lecture);
            }
        })
    }

    selectLectureToShow(lectureId) {
        var that = this;

        let elaborationIds = [];
        database.ref('lectures/' + that.courseId + lectureId).once('value').then(function(snapshot){
            let current = snapshot.val();

            for(var index in current) {
                elaborationIds.push(current[index]);
            }
        });

        for(var id in elaborationIds) {
            database.ref('elab-request/' + id).once('value').then(function(snapshot) {
                let elaboration = snapshot.val();
                let answerObj = elaboration.answers;
                if(typeof answerObj == 'undefined') {
                    that.pendingER.push(answerObj);
                }
            });
        }
    }

    render() {
        var that = this;

        return (<h>Something</h>)
    }
}
