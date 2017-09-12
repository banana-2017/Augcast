// Initialize and authenticate Firebase client
var merge = require('deepmerge');
var admin = require('firebase-admin');
var serviceAccount = require('../database/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://augcast-465ef.firebaseio.com'
});
let adminDatabase = admin.database();

// Open file on disk for writing
var fs = require('fs');

// Run the podcast.ucsd.edu scraper to generate the most updated json
console.log('[SCRAPE] Scraping podcast.ucsd.edu...');
let spawn = require('child_process').spawn;
let proc = spawn('./PodcastUCSDScraper.py');

// Once python script finishes, update database with new lectures
proc.stdout.on('data', function(buffer) {
    let pythonStdout = buffer.toString();
    console.log('[SCRAPE] ' + pythonStdout);

    // Collect new json object created by the scraper
    let courses = require('./courses.json');
    let lectures = require('./lectures.json');

    // Update the database with the merged objects
    updateDatabaseObject('/courses', courses, false, null);
    updateDatabaseObject('/lectures', lectures, true, function() {
        process.exit();
    });

});

/**
* Deep merges toMerge into the object at the Firebase path specified by
* objectKey and updates Firebase with the newly merged object.
* Finds the diff between the old and merged objects and creates a queue
* for the OCR backend.
*
* @param  {String}   objectKey     Path to JSON object in Firebase to merge into
* @param  {Object}   toMerge       The JSON Object to merge
* @param  {Boolean}  toCreateQueue Whether or not to create a queue for the OCR backend from this diff
* @param  {Function} callback      Function that executes upon completion
* @return {None}
*/
function updateDatabaseObject(objectKey, toMerge, toCreateQueue, callback) {
    adminDatabase.ref(objectKey).once('value').then(function(snapshot) {

        console.log('[UPDATE] on ' + objectKey + ', queue=' + toCreateQueue);

        // Merge DB object with newly scraped json
        let current = snapshot.val();
        // console.log('CURRENT ' + objectKey);
        // console.log(JSON.stringify(current, null, 4));

        var merged = current == null ? toMerge : merge(current, toMerge);

        // console.log('MERGED' + objectKey);
        // console.log(JSON.stringify(merged, null, 4));

        // Create queue for the OCR engine or not
        if (toCreateQueue) {
            // Create delta
            let delta = current == null ? merged : diff(current, merged);

            // Output delta to disk
            fs.writeFile('./queue.json', JSON.stringify(delta, null, 4), 'utf8', function (err) {
                if (err) {
                    console.err('Error saving queue: ' + err);
                    return console.log(err);
                }
                console.log('[UPDATE] Queue saved!');
            });


            // console.log('NEW' + objectKey);
            // console.log(JSON.stringify(toMerge, null, 4));

            console.log('[UPDATE] DELTA ' + objectKey);
            console.log(JSON.stringify(delta, null, 4));
        }

        // Update db with merged object
        adminDatabase.ref(objectKey).update(merged).then(function() {
            console.log('[UPDATE] Synchronization succeeded at ' + objectKey);
            if (callback != null) callback();
        }).catch(function(error) {
            console.log('[UPDATE] Synchronization failed at ' + objectKey + ', error: ' + error);
            if (callback != null) callback();
        });

    });

    return;
}

function isEmpty(o) {
    for (var p in o) {
        if (o.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
}

/**
 * https://stackoverflow.com/a/13389935/4872908
 */
var diff = function(obj1, obj2) {
    var ret = {},rett;
    for(var i in obj2) {
        rett = {};
        if (typeof obj2[i] === 'object'){
            rett = diff(obj1[i], obj2[i]);
            if (!isEmpty(rett) ){
                ret[i]= rett;
            }
        } else {
            if(!obj1 || !obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
                ret[i] = obj2[i];
            }
        }
    }
    return ret;
};
