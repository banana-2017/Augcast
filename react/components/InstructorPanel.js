import React from 'react';
import { database } from './../../database/database_init';
import { connect } from 'react-redux';

import Tooltip from 'react-toolbox/lib/tooltip';
import { Layout, AppBar, NavDrawer, Navigation, Panel } from 'react-toolbox';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import {Tab, Tabs} from 'react-toolbox';
import {Button, IconButton} from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';

import PendingER from './PendingER'
import AppointInstructor from './AppointInstructor';

const TooltipButton = Tooltip(Button);

class InstructorPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // States about UI
            dialogActive: false,
            tabIndex:1,
        };

        this.handleToggle = this.handleToggle.bind(this);
    }

    handleToggle() {
        this.setState({dialogActive: !this.state.dialogActive})
    }

    render() {
        var that = this;

        // If the instructor panel has been opened, display the dialog
        if(that.state.dialogActive) {
            return (
                <Dialog active={this.state.dialogActive}
                        onEscKeyDown={this.handleToggle}
                        onOverlayClick={this.handleToggle}
                        title='My awesome dialog'>

                    <Tabs index={this.state.tabIndex} onChange={(index)=>{this.setState({tabIndex: index})}} fixed>
                        <Tab label='Instructor Management'>
                            <AppointInstructor
                                course={this.props.course}
                                username={this.props.username} />
                        </Tab>
                        <Tab label='Pending ERs'>
                            <PendingER course={this.props.course} />
                        </Tab>
                    </Tabs>
                </Dialog>
            )
        }

        // If the instructor panel has not been opened, display the button
        else {
            return (
                <TooltipButton
                    icon="class"
                    className="instructor-button"
                    tooltip="Open Instructor Panel"
                    tooltipPosition="right"
                    onClick={()=>{that.setState({dialogActive: true})}} />
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        username: state.username
    };
}

const InstructorPanelContainer = connect (mapStateToProps, null)(InstructorPanel);
export default InstructorPanelContainer;
