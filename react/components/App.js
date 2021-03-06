import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

/*
 * Navbar, outer most components
 */
class App extends React.Component {

    render () {
        return (
            <MuiThemeProvider>
                {this.props.children}
            </MuiThemeProvider>
        );
    }
}

export default App;
