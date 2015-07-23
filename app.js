#!/usr/bin/env node

var Jimp = require("jimp");
var argv = require("optimist").argv;
var fs = require("fs");
var path = require("path");
var async = require('async');
var clc = require('cli-color');


if (argv.source && argv.destination && argv.opacity && argv.report) {
    var tasks = [];
    var srcdir = argv.source;
    var destdir = argv.destination;
    var opacityValue = +argv.opacity;
    var reportFile = argv.report;

    console.log('File Conversion Started');
    fs.readdir(srcdir, function (error, files) {
        files.forEach(function (file) {
            if (file.match(/.png/)) {
                tasks.push(function (callback) {
                    var srcFilePath = path.join(srcdir, file);
                    var destFilePath = path.join(destdir, file);
                    var status = 'SUCCESS File: "' + srcFilePath + '" to PATH: "' + destFilePath + '"\n';
                    var lenna = new Jimp(srcFilePath, function (err, image) {
                        if (err) {
                            throw err;
                        } else {
                            this.opacity(opacityValue).write(destFilePath);
                        }
                        fs.appendFile(reportFile, status, function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(clc.green(status));
                            }
                        });
                        callback(err, status);
                    })
                });
            } else {
                var message = 'SKIP FILE: ' + path.join(srcdir, file) + '\n';
                fs.appendFile(reportFile, message, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(clc.yellow(message));
                    }
                });
            }
        });
        async.series(tasks, function (error, data) {
            if (error) {
                console.log(clc.red(JSON.stringify(error)));
            } else {
                console.log(clc.blue('Conversion Successfully Completed \nYou can find Status Report on FILE: ' + reportFile));
            }
        });
    });
} else {
    console.log('Insufficient Arguments');
    console.log('opacitytool --source EnterSourceFolderPath --destination EnterDestinationFolderPath --opacity OpacityLevel --report ReportFilePath');
    console.log('Example: opacitytool --source ./src --destination ./dest --opacity 0.5 --report ./report.txt');
}


