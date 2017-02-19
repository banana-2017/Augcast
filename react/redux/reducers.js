import {LOG_OUT, LOG_IN, UPDATE_COURSE, IS_INSTRUCTOR} from './actions';

/**
* state of the app
* loggedIn: true if user is logged in, false otherwise
* currentCourse: ID of the course currently selected
*/
const initialState = {
    loggedIn : true,
    currentCourse: undefined,
    userType: 'STUDENT',
    username: undefined,
};


/**
* reducers for our app
* LOG_OUT: returns state with loggedIn as false
* LOG_IN: returns state with loggedIn as true
* UPDATE_COURSE: returns state with currentCourse set to the current courseId
*/
function appReducers (state, action) {

    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {

    case LOG_OUT: {
        return Object.assign ({}, state, {
            loggedIn: false
        });
    }

    case LOG_IN: {
        return Object.assign ({}, state, {
            loggedIn: true
        });
    }

    case UPDATE_COURSE: {
        return Object.assign ({}, state, {
            currentCourse: action.courseId
        });
    }

    case IS_INSTRUCTOR: {
        return Object.assign ({}, state, {
            userType: 'INSTRUCTOR'
        });
    }

    }

    return state;
}




export default appReducers;
