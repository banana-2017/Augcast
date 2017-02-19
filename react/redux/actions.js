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
export function logIn () {
    return {
        type: LOG_IN
    };
}

export function logOut () {
    return {
        type: LOG_OUT
    };
}

export function updateCourse (courseId) {
    return {
        type: UPDATE_COURSE,
        courseId: courseId
    };
}

export function makeInstructor () {
    return {
        type: IS_INSTRUCTOR,
    };
}
