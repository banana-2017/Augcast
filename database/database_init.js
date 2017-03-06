import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';
import conf from './credentials.json';

if (firebase.apps.length === 0) {
    firebase.initializeApp(conf);
}

export let database = firebase.database();
export let storageRef = firebase.storage().ref();
export let auth = firebase.auth();
export let firebaseApp = firebase;
