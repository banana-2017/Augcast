import React from 'react';
import { Link } from 'react-router';


/**
 Home module - to be displayed on the side
 */
class Home extends React.Component {

    render () {
        return (
            <div>
            <h1>Home</h1>
            <Link to="/videoview">Open VideoView</Link>
            </div>
        );
    }
}

export default Home;
