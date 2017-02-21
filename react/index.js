import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

<<<<<<< HEAD
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
=======
import routes from './routes';
>>>>>>> master
import appReducers from './redux/reducers';

let store = createStore (appReducers);

// React main class and router
class Augcast extends React.Component {
    render () {
        return (
            <Provider store={store} >
<<<<<<< HEAD
                <Router history={browserHistory}>
                    <Route path="/" component = {App} onEnter={authenticate}>
                        <IndexRoute component = {Home}/>
                    </Route>
                    <Route path="/videoplayer" component={VideoView} />
                    <Route path="/login" component = {Login}/>
                </Router>
=======
                <Router routes={routes} history={browserHistory}/>
>>>>>>> master
            </Provider>
        );
    }
}

ReactDOM.render (<Augcast/>, document.getElementById('app'));
