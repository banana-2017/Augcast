var queue = require ('./queue.json');
var http = require('http-request');
var fs = require('fs');
var spawn = require ('child_process').spawn;
var parseUtils = require ('./parseUtils.js');
var database = require ('../database/admin_database_init').adminDatabase;

const VIDEO_DIR = 'video_files';
const OCR_DIR = 'ocr_output';
const DETECTION_SCRIPT = '../ocr/detector.py';
const SORTING_SCRIPT = '../ocr/sorter.py';
const CONTENT_SCRIPT = '../ocr/extractor.py';

var lecturesQueued = 0;
var lecturesProcessed = 0;

// previous task still going on
if (queue.inProgress) {
    console.log ('Video processing in progress.');
}

var pushDataToFirebase = function (lectureName, uniqueSlidesDir, contentsArray, timestampArray, currentCourse) {

    console.log ('Pushing data to firebase for '+ lectureName);
    var updates = {};
    var ref = database.ref ('lectures/'+currentCourse+'/'+lectureName);

    updates['timestamps'] = timestampArray;
    updates['contents'] = contentsArray;

    ref.update(updates).then (function() {
        console.log ('Successfully updated data for '+ lectureName);
        lecturesProcessed++;

        if (lecturesQueued == lecturesProcessed) {
            process.exit (1);
        }

    }, function(err) {
        console.log ('Error while updating data for '+ lectureName +'\n'+err);
        lecturesProcessed++;

        if (lecturesQueued == lecturesProcessed) {
            process.exit (0);
        }
    });
};

/**
 *  Parses the output of the ocr processing and uploads it to firebase
 */
var processOcrOutput = function (lectureName, slidesDir, uniqueSlidesDir, contentsDir, timetableFile, currentCourse) {
    parseUtils.parseTimetable (timetableFile, function (timestampArray) {
        let contentsArray = parseUtils.parseContents (contentsDir, timestampArray.length);
        pushDataToFirebase (lectureName, uniqueSlidesDir, contentsArray, timestampArray, currentCourse);
    });
};

/**
* Handles video processing by starting python subprocesses
*/
var processVideo = function (lectureName, filename, currentCourse) {
    console.log ('Completed download: ' + filename);

    let slidesDir = OCR_DIR + '/' + lectureName + '/' + 'slides/';
    let uniqueSlidesDir = OCR_DIR + '/' + lectureName + '/' + 'unique/';
    let contentsDir = OCR_DIR + '/' + lectureName + '/' + 'contents/';
    let timetableFile = OCR_DIR + '/' + lectureName + '/' + 'timetable.txt';

    let detectionArgs = [DETECTION_SCRIPT, '-d', filename, '-o', slidesDir];
    let sortingArgs = [SORTING_SCRIPT, '-d', slidesDir, '-o', uniqueSlidesDir, '-t', timetableFile];
    let extractionArgs = [CONTENT_SCRIPT, '-d', uniqueSlidesDir, '-o', contentsDir];

    fs.mkdirSync(OCR_DIR + '/' + lectureName);

    //processOcrOutput (lectureName, slidesDir, uniqueSlidesDir, contentsDir, timetableFile);

    const detection = spawn('python', detectionArgs);
    detection.on('close', (code) => {
        console.log ('Detection for '+ lectureName + ' completed with exit code ' + code);
        if (code != 0) {
            process.exit (code);
        }

        const sorting = spawn ('python', sortingArgs);
        sorting.on ('close', (code) => {
            console.log('Sorting for '+ lectureName + ' completed with exit code ' + code);
            if (code != 0) {
                process.exit (code);
            }

            const contentExtraction = spawn ('python', extractionArgs);
            contentExtraction.on ('close', (code) => {
                console.log('Content extraction for '+ lectureName + ' completed with exit code ' + code);
                if (code != 0) {
                    process.exit (code);
                }

                processOcrOutput (lectureName, slidesDir, uniqueSlidesDir, contentsDir, timetableFile, currentCourse);
            });
        });

    });
};

var lectures = queue.lectures;

/*
 * Script starts downloading and processing videos
 */
Object.keys(lectures).forEach (function (course) {
    console.log ('Processing course ' + course);
    let currentCourse = lectures[course];

    Object.keys(currentCourse).forEach (function (lecture) {
        console.log ('Processing lecture ' + lecture);

        let video_url = currentCourse[lecture].video_url;

        if (video_url.endsWith('.mp4')) {

            let filename = VIDEO_DIR + '/' + lecture + '.mp4';
            lecturesQueued++;

            //processVideo (lecture, filename);
            //pushDataToFirebase (lecture)

            console.log ('Starting download: ' + filename);
    /*        download(video_url).then(data => {
                fs.writeFileSync(filename, data);
                processVideo (lecture, filename, course);
            });
    */
            // save the response to file with a progress callback
            http.get({
                url: video_url,
                progress: function (current, total) {
                    if (current == total) {
                        processVideo(lecture, filename, course);
                    }
                }
            },
            filename,
            function (err, res) {
                if (err) {
                    console.error(err);
                    return;
                }

                console.log(res.code, res.headers, res.file);
            });

        } else {
            console.log('Skipping ' + video_url + ', not a video.');
        }

    });
});
