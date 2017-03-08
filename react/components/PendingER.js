import React from 'react';
import { database } from '../../../database/database_init';

class PendingER extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataRetrieved: false,
        }

        // Instance Variable
        this.courseId = this.props.course.id;
    }
}
