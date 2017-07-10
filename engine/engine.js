var queue = require ('./queue.json');
var download = require ('download')
var http = require('http');
var fs = require('fs');

const VIDEO_DIR = "video_files";

// previous task still going on
if (queue.inProgress) {
    console.log ("Video processing in progress.");
    process.exit (1);
}

/**
* Handles video processing by starting python subprocesses
*/
var processVideo = function (lectureName, filename) {
    console.log ("Completed download: " + filename)
}

var lectures = queue.lectures;

for (course in lectures) {
    console.log ("Processing course " + course);
    let currentCourse = lectures[course];

    for (lecture in currentCourse) {
        console.log ("Processing lecture " + lecture);

        let video_url = currentCourse[lecture].video_url;
        let filename = VIDEO_DIR + "/" + lecture + ".mp4";

        console.log ("Statring download: " + filename);
        download(video_url).then(data => {
            fs.writeFileSync(filename, data);
            processVideo (lecture, filename);
        });
    }
}
