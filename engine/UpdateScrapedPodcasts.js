// Initialize and authenticate Firebase client
var merge = require('deepmerge');
var admin = require('firebase-admin');
var serviceAccount = require('../database/serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://augcast-465ef.firebaseio.com'
});
var adminDatabase = admin.database();
var fs = require('fs');

const QUEUE = './queue.json';

// Run the podcast.ucsd.edu scraper to generate the most updated json
console.log('[SCRAPE] Scraping podcast.ucsd.edu...');
let spawn = require('child_process').spawn;
let proc = spawn('./UCSDPodcastScraper.py');

// Once python script finishes, update database with new lectures
proc.stdout.on('data', function(buffer) {
    let pythonStdout = buffer.toString();
    console.log('[SCRAPE] ' + pythonStdout);

    // Collect new json object created by the scraper
    let courses = require('./courses.json');
    let lectures = require('./lectures.json');

    // Update the database with the merged objects
    updateDatabaseObject('courses', courses, false, null);
    updateDatabaseObject('lectures', lectures, true, (status) => {
        process.exit(status);
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
        console.log('[UPDATE] Merged', objectKey);


        // console.log('MERGED' + objectKey);
        // console.log(JSON.stringify(merged, null, 4));

        let toUpdateDB = true;

        // Create queue for the OCR engine if requested
        if (toCreateQueue) {
            // Get difference between current DB and merged lectures
            let delta = current == null ? merged : diff(current, merged);
            let toWrite = {inProgress: false};
            toWrite.lectures = delta;
            toWrite.modified = new Date().toISOString().replace('T', ' ').replace(/\..*$/, '');

            console.log('[UPDATE] Ready to save queue', objectKey);

            // Create queue file on disk
            let queue = require(QUEUE);
            if (queue.inProgress == null || queue.inProgress == false) {
                fs.writeFile(QUEUE, JSON.stringify(toWrite, null, 4), 'utf8', function (err) {
                    if (err) {
                        console.err('Error saving queue: ' + err);
                        return console.log(err);
                    }
                    console.log('[UPDATE] Queue saved!');
                });
            }

            // Queue is still being processed, do not overwrite queue or update DB
            // (can't update DB because if we do, the current changes will not
            // show up in the next run of this script (because they would exist
            // in the DB), so OCR will never run on those lectures. DB will be
            // updated the next time this script runs and the queue isn't busy.)
            else {
                toUpdateDB = false;
                console.log('[UPDATE] Queue inProgress is true, not updating queue or DB!');
            }

            console.log('[UPDATE] DELTA ' + objectKey);
            console.log(JSON.stringify(delta, null, 4));
        }

        // Update DB with merged object if queue creation didn't fail
        if (toUpdateDB) {
            console.log('[UPDATE] Ready to update db', objectKey);
            adminDatabase.ref(objectKey).update(merged).then(function() {
                console.log('[UPDATE] Synchronization succeeded at ' + objectKey);
                if (callback != null) callback(0);
            }).catch(function(error) {
                console.log('[UPDATE] Synchronization failed at ' + objectKey + ', error: ' + error);
                if (callback != null) callback(0);
            });
        } else {
            callback(1);
        }
    });
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

function isEmpty(o) {
    for (var p in o) {
        if (o.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
}
