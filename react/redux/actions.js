var $ = require ('jquery')

/**
* action types
*/

export const LOG_OUT = 'LOG_OUT';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';

export const NAVIGATE_COURSE = 'NAVIGATE_COURSE';
export const UPDATE_SEARCH_SLIDES = 'UPDATE_SEARCH_SLIDES';
export const UPDATE_JUMP_SLIDE = 'UPDATE_JUMP_SLIDE';
export const DISPLAY_LECTURE = 'DISPLAY_LECTURE';
export const SKIP_TO_TIME = 'SKIP_TO_TIME';
export const UPDATE_USER = 'UPDATE_USER';
export const IS_INSTRUCTOR = 'IS_INSTRUCTOR';
export const IS_FETCHING = 'IS_FETCHING';


/**
 * action creators
 */


// async, returns function that takes a dispatch
export function logIn (email, password, router) {

    return (dispatch) => {
        return $.ajax({

            url: '/api/login',
            type: 'POST',
            data: {
                'email': email,
                'password': password
            },

            success: function() {
                dispatch(loginSuccess());
                setTimeout(() => router.push('/'), 7000);
                return true;
            }.bind(this),

            error: function() {
                dispatch(loginFailure());
                return false;
            }.bind(this)

        });
    };
}

export function loginRequest () {
    return {
        type: LOG_IN_REQUEST
    };
}

export function loginSuccess() {
    return {
        type: LOG_IN_SUCCESS
    };
}

export function loginFailure () {
    return {
        type: LOG_IN_FAILURE
    };
}


export function logout () {
    return {
        type: LOG_OUT
    };
}

export function navigateCourse (navCourse) {
    return {
        type: NAVIGATE_COURSE,
        navCourse: navCourse
    };
}

export function displayLecture (currentCourse, currentLecture) {
    return {
        type: DISPLAY_LECTURE,
        currentCourse: currentCourse,
        currentLecture: currentLecture
    };
}

export function skipToTime (currentTime) {
    return {
        type: SKIP_TO_TIME,
        currentTime: currentTime
    };
}

export function updateUser (username) {
    return {
        type: UPDATE_USER,
        username: username
    };
}

export function updateSearchSlides (slides, slide) {
    // slides: all matched slides of the lecture
    // slide: the slide that was clicked
    return {
        type: UPDATE_SEARCH_SLIDES,
        slides: slides,
        slide: slide
    };
}

export function updateJumpSlide (slide) {
    // slides: all matched slides of the lecture
    // slide: the slide that was clicked
    return {
        type: UPDATE_JUMP_SLIDE,
        slide: slide
    };
}

export function makeInstructor () {
    return {
        type: IS_INSTRUCTOR,
    };
}
