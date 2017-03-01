import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';

import database from '../database/database_init';
import Home from './components/Home';
import App from './components/App';

// Write a test JSON object to the database
// React main class and router
class Augcast extends React.Component {
    render () {
        return (
            <Router history={browserHistory}>
            <Route path="/" component = {App}>
            <IndexRoute component = {Home}/>
            </Route>
            </Router>
        );
    }
}

// Example of reading the value of the "test" JSON object from the DB
// and then displaying it with React

var user_id = 'goo';

database.ref('users/' + user_id).once('value')
.then(function(snapshot) {
    console.log(JSON.stringify( /** THE VALUE **/ snapshot.val() /** THE VALUE **/ ));
});


ReactDOM.render (<Augcast/>, document.getElementById('app'));
