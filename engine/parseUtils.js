var readline = require ('readline');
var fs = require ('fs');

const SECONDS_IN_HOURS = 3600;
const SECONDS_IN_MINUTES = 60;

/**
 * Parses the timetable output for the video
 */
exports.parseTimetable = function (timetablePath, cb) {

    console.log (timetablePath);
    let timeArray = [];

    const rl = readline.createInterface({
        input: fs.createReadStream(timetablePath)
    });

    rl.on ('line', function (line) {
        let tokens = line.split (':');

        let hours = parseInt(tokens[1]);
        let minutes = parseInt(tokens[2]);
        let seconds = parseInt(tokens[3]);

        let timeInSeconds = hours * SECONDS_IN_HOURS +
                            minutes * SECONDS_IN_MINUTES +
                            seconds;

        timeArray.push (timeInSeconds);

    })

    rl.on ('close', function () {
        cb(timeArray);
    });
}


/**
 * Parses the text contents for the video
 */
exports.parseContents = function (contentsDir, length) {

    let contentsArray = [];

    for (var i = 1; i <= length; i++) {
        let filename = contentsDir + i + '.txt';
        var data = fs.readFileSync (filename, 'utf-8');

        // replace newlines with space
        data = data.replace(/\n/g, " ");

        contentsArray.push (data.trim());
    }

    //console.log (contentsArray);
}
