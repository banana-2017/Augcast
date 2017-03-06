// react
import React from 'react';
import ReactDOM from 'react-dom';

// redux
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import appReducers from './redux/reducers';

// routing
import routes from './routes';
import {Router, browserHistory} from 'react-router';

// setting up the redux store
let store = createStore (appReducers,
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
);



// React main class and router
class Augcast extends React.Component {
    render () {
        return (
            <Provider store={store} >
                <Router routes={routes} history={browserHistory}/>
            </Provider>

        );
    }
}


/**
 * gets login state from store and redirects route
 *
 * nextState: current state of the router
 * replace: triggers transition to different URL
 * callback: continues transition
 */
export function authenticate (nextState, replace, transition) {
    let {loggedIn} = store.getState();
    console.log (loggedIn);
    if (!loggedIn) {
        console.log ('replacing with login');
        replace ('/login');
    }

    transition();
}

ReactDOM.render (<Augcast/>, document.getElementById('app'));
