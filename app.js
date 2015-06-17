#!/usr/bin/env node

var Jimp = require("jimp");
var argv = require("optimist").argv;
var fs = require("fs");
var path = require("path");

if (argv.src && argv.dest && argv.o) {
    console.log('File Conversion Started');
    var readFiles = fs.readdirSync(argv.src);
    readFiles.forEach(function (fileName) {
        var sourcePath = path.join(argv.src, fileName);
        var destDirPath = path.join(argv.dest, fileName);

        var lenna = new Jimp(sourcePath, function (err, image) {
            if(err){
                throw err;
            }
            this.opacity(+argv.o).write(destDirPath); // save again
            console.log('Source File: ' + sourcePath);
            console.log('Success Converted Saved: ' + destDirPath);
        });
    });
    console.log('Conversion Process Completed');
} else {
    console.log('Insufficient Arguments');
    console.log('opacitytool --src EnterSourceFolderPath --dest EnterDestinationFolderPath --o OpacityLevel');
    console.log('Example:opacitytool  --src /dest --dest /reselt --o 0.5');
}
