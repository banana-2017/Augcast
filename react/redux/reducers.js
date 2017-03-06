import {LOG_OUT, LOG_IN_SUCCESS,LOG_IN_FAILURE,
        LOG_IN_REQUEST, UPDATE_COURSE, IS_INSTRUCTOR} from './actions';

/**
* state of the app
* loggedIn: true if user is logged in, false otherwise
* currentCourse: ID of the course currently selected
*/
const initialState = {
    isFetching: false,
    loggedIn : false,
    currentCourse: undefined,
    currentLecture: undefined,
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

    case LOG_IN_SUCCESS: {
        return Object.assign ({}, state, {
            loggedIn: true,
            isFetching: false
        });
    }

    case LOG_IN_FAILURE: {
        return Object.assign ({}, state, {
            loggedIn: false,
            isFetching: false

        });
    }

    case LOG_IN_REQUEST: {
        return Object.assign ({}, state, {
            isFetching: true
        });
    }

    case UPDATE_COURSE: {
        return Object.assign ({}, state, {
            currentCourse: action.courseId,
            currentLecture: action.lectureId
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
