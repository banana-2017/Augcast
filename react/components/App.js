import React from 'react';

/*
 * Navbar, outer most components
 */
class App extends React.Component {

    render () {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}


export default App;
