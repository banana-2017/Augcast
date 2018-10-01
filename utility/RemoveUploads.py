var admin = require('firebase-admin');
var serviceAccount = require('../database/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://augcast-465ef.firebaseio.com'
});

// Remove all uploaded content across all lectures
admin.database().ref('/lectures/').on('value', function(snapshot) {
    var lectures = snapshot.val();
    for (var course in lectures) {

        var curCourse = lectures[course];

        for (var lec in curCourse) {

            var cur = curCourse[lec];

            // Skip the Goo-labeled slides
            if (cur.id == 'cse101-b-0' ||
                cur.id == 'cse101-b-1' ||
                cur.id == 'cse101-b-2' ||
                cur.id == 'cse101-b-3') continue;

            if (cur.labelProgress != undefined
                || cur.slides_url != undefined || cur.timestamps != undefined) {
                cur.labelProgress = null;
                cur.slides_url = null;
                cur.timestamps = null;
                console.log('deleted info from: ' + cur.id);
            }
        }
    }

    admin.database().ref('/lectures/').update(lectures);
    //    process.exit();

}, function (errorObject) {
    console.log('The read failed: ' + errorObject.code);
});
