import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';

//import Database from '../database/database_init';
import Home from './components/Home';
import App from './components/App';
import VideoPlayer from './components/Video';


// Write a test JSON object to the database
/*
database.ref('test').update({
time: 5
});
console.log('Writing to DB complete');
*/

// React main class and router
class Augcast extends React.Component {
    render () {
        return (
            <Router history={browserHistory}>
                <Route path="/" component = {App}>
                    <IndexRoute component = {Home}/>
                </Route>
                <Route path="/videoplayer" component={VideoPlayer} />
            </Router>
        );
    }
}

// Example of reading the value of the "test" JSON object from the DB
// and then displaying it with React
/*
database.ref('/test').once('value').then(function(snapshot) {
ReactDOM.render (<App dbRead= {JSON.stringify(snapshot.val())} />,
document.getElementById('app'));
});
*/

ReactDOM.render (<Augcast/>, document.getElementById('app'));
