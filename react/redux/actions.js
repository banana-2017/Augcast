/**
* action types
*/

export const LOG_OUT = 'LOG_OUT';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';

export const UPDATE_COURSE = 'UPDATE_COURSE';
export const UPDATE_USER = 'UPDATE_USER';
export const IS_INSTRUCTOR = 'IS_INSTRUCTOR';
export const IS_FETCHING = 'IS_FETCHING';


/**
 * action creators
 */


// async, returns function that takes a dispatch
export function logIn (email, password, router) {

    let config = {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            password
        })
    };

    return (dispatch) => {
        dispatch (loginRequest());

        return fetch('/api/login', config)
        .then(response => {
            // this fucking returns a promise
            return response.json();
        }).then (obj => {

            if (obj.success) {
                dispatch(loginSuccess());
                setTimeout(() => router.push('/'), 1000);
                return true;
            }

            else {
                dispatch(loginFailure());
                return false;
            }
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

export function logOut () {
    return {
        type: LOG_OUT
    };
}

export function updateCourse (courseId, lectureId) {
    return {
        type: UPDATE_COURSE,
        courseId: courseId,
        lectureId: lectureId
    };
}

export function updateUser (username) {
    return {
        type: UPDATE_USER,
        username: username
    };
}

export function makeInstructor () {
    return {
        type: IS_INSTRUCTOR,
    };
}
