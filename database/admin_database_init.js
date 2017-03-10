import * as admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';
import conf from './credentials.json';

var baseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: conf.databaseURL
});

export let adminDatabase = baseApp.database();
export let adminFirebaseApp = baseApp;
