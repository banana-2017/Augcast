module.exports = function() {
    // Include firebase
    var firebase = require('firebase/app');
    require('firebase/database');

    // Get credentials for Firebase login
    // Do not share or commit credentials.json!
    var conf = require('./credentials.json');
    var config = {
        apiKey: conf.apiKey,
        authDomain: conf.authDomain,
        databaseURL: conf.databaseURL,
        storageBucket: conf.storageBucket
    };

    // Log in to Firebase
    firebase.initializeApp(config);

    // Return a reference to the database
    return firebase.database();
}
