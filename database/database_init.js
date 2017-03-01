import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import conf from './credentials.json';

if (firebase.apps.length === 0) {
    firebase.initializeApp(conf);
}

export let database = firebase.database();
export let storageRef = firebase.storage().ref();
export let firebaseApp = firebase;
