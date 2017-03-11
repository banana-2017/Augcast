var admin = require("firebase-admin");
var serviceAccount = require("../database/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://augcast-465ef.firebaseio.com"
});

// Remove all uploaded content across all lectures
admin.database().ref('/lectures/').on("value", function(snapshot) {
    var lectures = snapshot.val();
    var that = this;
    for (var course in lectures) {

        var curCourse = lectures[course];

        for (var lec in curCourse) {

            var cur = curCourse[lec];

            //console.log('on ' + cur.id + '\n');

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
  console.log("The read failed: " + errorObject.code);
});
