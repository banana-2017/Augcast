// NotFound.js
// Handling 400 Not Found
import React from 'react';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        console.log("Peanut Butter Jelly Time!");
        return (
            <div className="not-found">
                <div className="banana" />
                404 NOT FOUND
            </div>
        );
    }
}

export default NotFound;
