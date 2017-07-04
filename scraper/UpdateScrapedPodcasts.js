// Initialize and authenticate Firebase client
var admin = require('firebase-admin');
var serviceAccount = require('../database/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://augcast-465ef.firebaseio.com'
});
let adminDatabase = admin.database();

// Run the podcast.ucsd.edu scraper to generate the most updated json
console.log('Scraping podcast.ucsd.edu...');
let spawn = require('child_process').spawn;
let proc = spawn('./PodcastUCSDScraper.py');

// Once python script finishes, update database with new lectures
proc.stdout.on('data', function(buffer) {
    let pythonStdout = buffer.toString();
    console.log(pythonStdout);

    // Collect new json object created by the scraper
    let courses = require('./courses.json');
    //let lectures = require('./lectures.json');

    // Update the /courses object
    updateCourses(courses);
    //updateLectures(lectures);

    // Kill scraper's process and end script
    proc.kill('SIGINT');
});

function updateCourses(newCourses) {
    console.log('UPDATING COURSES');

    // The objects to add to the /courses object
    let updates = {};

    // Get current course list
    adminDatabase.ref('/courses').once('value').then(function(snapshot) {
        let currentCourses = snapshot.val();
        let counter = 0;

        // For each course in newly scraped list, if it does not exist in
        // current list, add to the updates object.
        for (var newCourse in newCourses) {
            if (!currentCourses.hasOwnProperty(newCourse)) {
                updates[newCourse] = newCourses[newCourse];
                counter++;
                console.log(newCourse + ' is a new entry.');
            } else {
                console.log(newCourse + ' already exists in /courses.');
            }
        }

        // Push updates to /courses object in database
        adminDatabase.ref('/courses/').update(updates);
        console.log(counter + ' new courses added.');
        console.log(JSON.stringify(updates, null, 2));
    });
}
