import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Home from './components/Home';
import App from './components/App';
import VideoView from './components/VideoView';


// Write a test JSON object to the database
/*
database.ref('test').update({
time: 5
});
console.log('Writing to DB complete');
*/
import Login from './components/Login';
import appReducers from './redux/reducers';

let store = createStore (appReducers);


/**
 * gets login state from store and redirects route
 *
 * nextState: current state of the router
 * replace: triggers transition to different URL
 * callback: continues transition
 */
function authenticate (nextState, replace, transition) {
    let {loggedIn} = store.getState();
    console.log (loggedIn);

    if (!loggedIn) {
        replace ('/login');
    }


    transition();
}

// React main class and router
class Augcast extends React.Component {
    render () {
        return (
            <Provider store={store} >
                <Router history={browserHistory}>
                    <Route path="/" component = {App} onEnter={authenticate}>
                        <IndexRoute component = {Home}/>
                    </Route>
                    <Route path="/videoplayer" component={VideoView} />
                    <Route path="/login" component = {Login}/>
                </Router>
            </Provider>
        );
    }
}

ReactDOM.render (<Augcast/>, document.getElementById('app'));
