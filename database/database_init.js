import firebase from 'firebase/app';
import 'firebase/database';
import conf from './credentials.json';

if (firebase.apps.length === 0) {
    firebase.initializeApp(conf);
}