import React from 'react';
import PDF from 'react-pdf-js';
import { database } from './../../database/database_init';
import { connect } from 'react-redux';
import { displayLecture, skipToTime } from '../redux/actions';
import { browserHistory } from 'react-router';

import ProgressBar from 'react-toolbox/lib/progress_bar';
import {Card, CardActions, CardHeader, CardText, CardMedia} from 'material-ui/Card';

import FlatButton from 'material-ui/FlatButton';

class PendingER extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lecturesTimestampERsArray: [],
            dataRetrieved: false,
            lectureInfo : {
                timestamps: undefined,
                pdf_url: undefined
            },
        };


        // Instance Variable
        this.pendingERs = [];

        this.elaborationsObj = {};
        this.lecturesObj = {};

        // Database query
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
        this.ignoreER = this.ignoreER.bind(this);
    }

    /*
     * Fill the lecturesArray by unpacking the elaborationsObj and lecturesObj
     * The structure of lecturesArray is:
     * lecturesArray                 timestampsArray    ERsArray
     * [{lecture: lectureObj, pdf: pdfUrl, timestamps: [{time: time, ERs: [ERs, ...]}, ...], ...]
     */
    update() {
        let lecturesArray = [];
        for(let lecture_key in this.elaborationsObj) {

            let timestampsArray = [];
            for(let timestamp_key in this.elaborationsObj[lecture_key]) {

                let ERsArray = [];
                for(let ER_key in this.elaborationsObj[lecture_key][timestamp_key]) {
                    let ER_temp = this.elaborationsObj[lecture_key][timestamp_key][ER_key];

                    // If the instructor has ignored that ER or it has a answer, then not display it
                    if(ER_temp.answers == null && ER_temp.ignore == null) {
                        // Add helper fields to facilitate modifying database
                        ER_temp.lecture_ref = lecture_key;
                        ER_temp.timestamp_ref = timestamp_key;
                        ER_temp.id = ER_key;

                        ERsArray.push(ER_temp);
                    }
                }

                let timestamp = {time: timestamp_key, ERs: ERsArray};
                timestampsArray.push(timestamp);
            }

            let lecture = {lecture: this.lecturesObj[lecture_key], timestamps: timestampsArray};
            lecturesArray.push(lecture);
        }

        this.setState({lecturesTimestampERsArray: lecturesArray});
    }

    /*
     * Jump to certain lecture and timestamp of certain ER
     */
    navigateER(lecture, timestamp) {
        this.props.skipToTime(Number(timestamp));
        this.props.displayLecture(this.props.course, lecture);
        browserHistory.push('/' + this.props.course.id + '/' + lecture.num);
    }

    /*
     * Ignore ER
     */
    ignoreER(ER) {
        let ERsArray_temp = this.state.lecturesTimestampERsArray;

        // Update the database so that this ER will not be displayed
        let ERObj = database.ref('elaborations/' + this.props.course.id + '/' + ER.lecture_ref + '/' + ER.timestamp_ref + '/' + ER.id);
        let updates = {};
        updates['ignore'] = true;
        ERObj.update(updates);

        // Remove it from array in state so that the page will be refreshed
        for(let i = 0; i < ERsArray_temp.length; i++) {
            if(ERsArray_temp[i].lecture.id == ER.lecture_ref) {
                for(let j = 0; j < (ERsArray_temp[i].timestamps).length; j++) {
                    let index = (ERsArray_temp[i].timestamps[j].ERs).indexOf(ER);
                    if(index >= 0) {
                        ERsArray_temp[i].timestamps[j].ERs.splice(index, 1);
                        break;
                    }
                }
                break;
            }
        }

        this.setState({lectureTimestampERsArray: ERsArray_temp});
    }


    render() {
        var that = this;

        let ERItem = function(ER, lecture, time) {
            if(ER != null) {
                let author = ER.author;
                // let email = ER.email;
                // let content = ER.content;
                let timestamp = ER.timestamp_ref;
                let slides_url = lecture.slides_url;
                let timestamps = lecture.timestamps;

                return (
                    <div key={ER.id}>
                        <Card>
                            <CardHeader
                                title={'Asked by ' + author}
                                actAsExpander={true}
                                showExpandableButton={true}
                            />
                            <CardText>
                                {ER.content}
                            </CardText>

                            {timestamps != null ?
                                (<CardMedia expandable={true}>
                                    <PDF file={slides_url}
                                         page={timestamps.indexOf(Number(time))}
                                         scale={1}
                                    />
                                </CardMedia>) : null}

                            <CardActions>
                                <FlatButton label="Detail" onClick={() => {
                                    that.props.handleToggle();
                                    that.navigateER(lecture, timestamp);
                                }}/>
                                <FlatButton label="Ignore" onClick={() => {
                                    that.ignoreER(ER);
                                }}/>
                            </CardActions>
                        </Card>
                    </div>
                );
            }
        };

        let timestampItem = function(timestamp, lecture) {
            if(timestamp.ERs.length > 0) {
                let time = timestamp.time;
                let ERs = timestamp.ERs;

                return (
                    <div key={time}>
                        <p>{'At time ' + time}</p>
                        {ERs.map(function (x) {
                            return ERItem(x, lecture, time);
                        })}
                    </div>
                );
            }
        };

        let lectureItem = function (lecture) {
            if(lecture.timestamps.length > 0) {
                // lecture detail
                let lectureObj = lecture.lecture;
                let lectureId = lectureObj.id;
                let week = lectureObj.week;
                let day = lectureObj.day;

                // timestamps
                let timestamps = lecture.timestamps;

                if(timestamps != null) {
                    return (
                        <div key={lectureId}>
                            <p>{lectureId + '   Week ' + week + ' ' + day}</p>
                            {timestamps.map( function(x) { return timestampItem(x, lectureObj); } )}
                        </div>
                    );
                }
            }
        };

        return (
            <div>
                {that.state.dataRetrieved ? that.state.lecturesTimestampERsArray.map(lectureItem) :
                    <ProgressBar type='circular' mode='indeterminate' multicolor />}
            </div>
        );
    }
}

function mapDispatchToProps (dispatch) {
    return {
        displayLecture: (currentCourse, currentLecture) => {
            dispatch (displayLecture(currentCourse, currentLecture));
        },
        skipToTime: (currentTime) => {
            dispatch (skipToTime(currentTime));
        }
    };
}

const PendingERContainer = connect (null, mapDispatchToProps)(PendingER);
export default PendingERContainer;


