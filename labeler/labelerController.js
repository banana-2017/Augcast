var spawn = require('child_process').spawn;
var process = spawn('python', ['./test.py']);

process.stdout.on('data', function(data) {
    console.log(data.toString());
});
