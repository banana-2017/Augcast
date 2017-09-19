// NotFound.js
// Handling 400 Not Found
import React from 'react';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        console.log('Peanut Butter Jelly Time!');
        return (
            <div className="404-wrapper">
                <div className="banana" />
                <div className="not-found">
                    404
                </div>
            </div>
        );
    }
}

export default NotFound;
