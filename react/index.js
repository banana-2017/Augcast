import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import routes from './routes';
import appReducers from './redux/reducers';

let store = createStore (appReducers);


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
ReactDOM.render (<Augcast/>, document.getElementById('app'));
