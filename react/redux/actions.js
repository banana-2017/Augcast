/**
* action types
*/

export const LOG_OUT = 'LOG_OUT';
export const LOG_IN = 'LOG_IN';

export const UPDATE_COURSE = 'UPDATE_COURSE';
export const IS_INSTRUCTOR = 'IS_INSTRUCTOR';


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

export function makeInstructor () {
    return {
        type: IS_INSTRUCTOR,
    };
}
