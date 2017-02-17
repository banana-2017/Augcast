import React from 'react';

/**
 Home module - to be displayed on the side
 */
class Home extends React.Component {

    render () {
        return (
            <div>
            <h1>Home</h1>
            <Link to="/video">Video</Link>
            </div>
        );
    }
}

export default Home;
