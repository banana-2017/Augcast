import React from 'react';

/*
 * Navbar, outer most components
 */
class App extends React.Component {

    render () {
        return (
            <div className="row">
                {this.props.children}
            </div>
        );
    }
}


export default App;
