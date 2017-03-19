var admin = require("firebase-admin");
var serviceAccount = require("../database/serviceAccountKey.json");
var jsonInput = require ("./input.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://augcast-465ef.firebaseio.com"
});

// Remove all uploaded content across all lectures

admin.database().ref('/lectures/cse101-b/cse101-b-3/').update({
    timestamps: jsonInput
});
