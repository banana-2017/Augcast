import React from 'react';
import { database } from './../../database/database_init';
import { connect } from 'react-redux';

import { Layout, AppBar, NavDrawer, Navigation, Panel } from 'react-toolbox';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import {Tab, Tabs} from 'react-toolbox';

import PendingER from './PendingER'
import AppointInstructor from './AppointInstructor';

class InstructorPanel extends React.Component {
    constructor(props) {
        super(props);

        this.testUser = "l1qiao";

        this.state = {
            // States about data
            dataRetrieved: false,
            currentCourse: undefined,

            // States about UI
            drawerActive: false,
            tabIndex:1,
        };

        console.log(this.props.username);
        this.instructorCourses = [];

        // query the database to get instructor courses
        var that = this;
        database.ref('users/' + that.testUser + '/instructorFor').once('value').then(function (snapshot1) {
            let Ids = snapshot1.val();
            let counter = 0;

            for (var index in Ids) {
                database.ref('courses/' + Ids[index]).once('value').then(function(snapshot2){
                    that.instructorCourses.push(snapshot2.val());

                    // use a counter to know whether the callbacks have finished or not
                    if(++counter === Object.keys(Ids).length) {
                        that.setState({lectureRetrieved: true});
                    }
                })
            }
        });
    }

    render() {
        var that = this;

        var listItem = function(course) {
            return (
                <div key={course.id}>
                    <ListItem
                        leftIcon="class"
                        caption={course.id}
                        legend={course.professor}
                        disabled={course == that.state.currentCourse}
                        onClick={()=>{that.setState({currentCourse: course});}}
                    />
                </div>
            )
        }

        return (
            <Layout>
                <NavDrawer active={this.state.drawerActive}
                           onOverlayClick={()=>{this.setState({drawerActive: !this.state.drawerActive})}}
                           permanentAt='xxxl'
                           pinned={true}
                           scrollY={true}>
                    {this.instructorCourses.map(listItem)}
                </NavDrawer>

                <Panel>
                    <AppBar title="Instructor Panel"
                            onLeftIconClick={()=>{this.setState({drawerActive: true})}}>
                    </AppBar>

                    <Tabs index={this.state.tabIndex} onChange={(index)=>{this.setState({tabIndex: index})}} fixed>
                        <Tab label='Instructor Management'>
                            {typeof this.state.currentCourse != 'undefined' ?
                                <AppointInstructor course={this.state.currentCourse}/> :
                                <div className="blank">Select a Course to start</div>}
                        </Tab>
                        <Tab label='Pending ERs'>
                            {typeof this.state.currentCourse != 'undefined' ?
                                <PendingER course={this.state.currentCourse}/> :
                                <div className="blank">Select a Course to start</div>}
                        </Tab>
                    </Tabs>
                </Panel>
            </Layout>
        )
    }
}

function mapStateToProps(state) {
    return {
        username: state.username
    };
}

const InstructorPanelContainer = connect (mapStateToProps, null)(InstructorPanel);
export default InstructorPanelContainer;

//export default InstructorPanel;