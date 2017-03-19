import React from 'react';
import { connect } from 'react-redux';

import Tooltip from 'react-toolbox/lib/tooltip';
import {Tab, Tabs} from 'react-toolbox';
import {Button} from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';


import PendingER from './PendingER';
import AppointInstructor from './AppointInstructor';

const TooltipButton = Tooltip(Button);

class InstructorButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // States about UI
            dialogActive: false,
            tabIndex:0,
        };

        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle() {
        this.setState({dialogActive: !this.state.dialogActive});
    }

    render() {
        var that = this;


        // If the instructor panel has been opened, display the dialog
        if(that.state.dialogActive) {
            return (
                <div>

                    <Dialog title={this.props.course.dept + ' ' + this.props.course.num + ' (' + this.props.course.section + '): Manage Course'}
                            className="instructor-panel"
                            modal={true}
                            active={this.state.dialogActive}
                            autoScrollBodyContent={true}
                            autoDetectWindowHeight={false}
                            onOverlayClick={this.handleToggle} >

                        <Tabs className="instructor-panel-tabs" index={this.state.tabIndex} onChange={(index)=>{this.setState({tabIndex: index});}} fixed>
                            <Tab label='Instructor Management'>
                                <AppointInstructor className="tab-content"course={this.props.course} username={this.props.username} />
                            </Tab>
                            <Tab label='Pending Elaboration Requests'>
                                <PendingER className="tab-content" course={this.props.course} handleToggle={this.handleToggle}/>
                            </Tab>
                        </Tabs>

                    </Dialog>
                </div>
            );
        }

        // If the instructor panel has not been opened, display the button
        else {
            return (
                <TooltipButton
                    icon="person"
                    className="instructor-button"
                    tooltip="Open Instructor Panel"
                    tooltipPosition="right"
                    onClick={()=>{that.setState({dialogActive: true});}}
                />
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        username: state.username
    };
}

const InstructorButtonContainer = connect (mapStateToProps, null)(InstructorButton);
export default InstructorButtonContainer;
