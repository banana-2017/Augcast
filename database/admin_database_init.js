var admin = require('firebase-admin');
var serviceAccount = require ('./serviceAccountKey.json');
var conf = require ('./credentials.json');

var baseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: conf.databaseURL
});

exports.adminDatabase = baseApp.database();
exports.adminStorage = baseApp.storage();
exports.adminFirebaseApp = baseApp;
