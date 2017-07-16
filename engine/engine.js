var queue = require ('./queue.json');
var download = require ('download')
var http = require('http');
var fs = require('fs');
var spawn = require ('child_process').spawn;

const VIDEO_DIR = "video_files";
const OCR_DIR = "ocr_output";
const DETECTION_SCRIPT = "../ocr/detector.py";
const SORTING_SCRIPT = "../ocr/sorter.py";
const CONTENT_SCRIPT = "../ocr/extractor.py";

// previous task still going on
if (queue.inProgress) {
    console.log ("Video processing in progress.");
    process.exit (1);
}

/**
 *  Parses the output of the ocr processing and uploads it to firebase
 */
var processOcrOutput = function (lectureName, slidesDir, uniqueSlidesDir, contentsDir, timetableFile) {
    // TODO
    process.exit (0);
}

/**
* Handles video processing by starting python subprocesses
*/
var processVideo = function (lectureName, filename) {
    console.log ("Completed download: " + filename)

    let slidesDir = OCR_DIR + '/' + lectureName + '/' + "slides/";
    let uniqueSlidesDir = OCR_DIR + '/' + lectureName + '/' + "unique/";
    let contentsDir = OCR_DIR + '/' + lectureName + '/' + "contents/";
    let timetableFile = OCR_DIR + '/' + lectureName + '/' + 'timetable.txt';

    let detectionArgs = [DETECTION_SCRIPT, '-d', filename, '-o', slidesDir];
    let sortingArgs = [SORTING_SCRIPT, '-d', slidesDir, '-o', uniqueSlidesDir, '-t', timetableFile];
    let extractionArgs = [CONTENT_SCRIPT, '-d', uniqueSlidesDir, '-o', contentsDir];

    fs.mkdirSync(OCR_DIR + '/' + lectureName);

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

                processOcrOutput (lectureName, slidesDir, uniqueSlidesDir, contentsDir, timetableFile);
            })
        })

    });
}

var lectures = queue.lectures;

/*
 * Script starts downloading and processing videos
 */
for (course in lectures) {
    console.log ("Processing course " + course);
    let currentCourse = lectures[course];

    for (lecture in currentCourse) {
        console.log ("Processing lecture " + lecture);

        let video_url = currentCourse[lecture].video_url;
        let filename = VIDEO_DIR + "/" + lecture + ".mp4";

        processVideo (lecture, filename);
        console.log ("Statring download: " + filename);
        download(video_url).then(data => {
            fs.writeFileSync(filename, data);
            processVideo (lecture, filename);
        });
    }
}
