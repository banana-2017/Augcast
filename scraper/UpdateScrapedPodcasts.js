// Initialize and authenticate Firebase client
var merge = require('deepmerge');
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
    let lectures = require('./lectures.json');

    updateDatabaseObject('/courses', courses);
    updateDatabaseObject('/lectures', lectures);

    // Kill scraper's process and end this script after 20 seconds.
    proc.kill('SIGINT');
    setTimeout(function() {
        console.log('Exiting UpdateScrapedPodcasts');
        process.exit();
    }, 20000);
});

/**
 * Deep merges toMerge into the object at the Firebase path specified by
 * objectKey and updates Firebase with the newly merged object.
 *
 * @param  {String} objectKey Path to JSON object in Firebase to merge into
 * @param  {Object} toMerge   The JSON Object to merge
 * @return {None}
 */
function updateDatabaseObject(objectKey, toMerge) {
    adminDatabase.ref(objectKey).once('value').then(function(snapshot) {
        let current = snapshot.val();
        var result = merge(current, toMerge);

        adminDatabase.ref(objectKey).update(result).then(function() {
            console.log('Synchronization succeeded at ' + objectKey);
        }).catch(function(error) {
            console.log('Synchronization failed at ' + objectKey + ', error: ' + error);
        });
    });
}
