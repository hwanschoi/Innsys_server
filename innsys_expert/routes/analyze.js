var express = require('express');
var router = express.Router();
var async = require("async");
var db = require('../db.js');
var multiparty = require('multiparty');
var uuid = require('uuid');
var fs = require('fs');
function analyzelItem() { }

router.get('/getAnalysisItem', function (req, res) {
    db.getEmptyAnalyseRequestCounselItem(function (err, results) {
        if (err) {
            res.end();
            return;
        }

        if (results.length == 0) {
            res.end();
            return;
        }

        var requestCounselItem = results[0]._doc;

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        var json = JSON.stringify({
            requestCounselItem
        });
        res.end(json);
    });
});

router.post('/request_analysis', function (req, res) {
    saveRequest(req, res, function (err) {
        if (err) {
            res.writeHead(500);
            res.end();
        }
        else {

        }
    });
});

function saveRequest(req, res, callback) {
    var context = {
        request: {
            value: null
        }
    };
    async.waterfall([

        function (callback) {
            var form = new multiparty.Form();
            // get field name & value

            var param_coaunt = 0;

            form.on("field", function (name, value) {
                context.request[name] = value;
            });

            form.on('part', function (part) {
                var filename;
                var size;

                if (part.filename) {
                    var path = require('path');
                    var ext = path.extname(part.filename) // returns '.html'
                    filename = uuid.v1() + ext;
                    size = part.byteCount;

                } else {
                    part.resume();
                }
                console.log("Write Streaming file :" + filename);
                var writeStream = fs.createWriteStream('public/analyze_data/images/' + filename);
                writeStream.filename = filename;
                part.pipe(writeStream);
                part.on('data', function (chunk) {
                    console.log(filename + ' read ' + chunk.length + 'bytes');
                });
                part.on('end', function () {
                    console.log(filename + ' Part read complete');
                    writeStream.end();
                    context.request[part.name] = '/analyze_data/images/' + filename;
                });
            });

            // all uploads are completed
            form.on('close', function () {
                //res.status(200).send('Upload complete');
                callback(null);
            });
            // track progress
            form.on('progress', function (byteRead, byteExpected) {
                console.log(' Reading total  ' + byteRead + '/' + byteExpected);
            });
            form.parse(req);
        },
        function (callback) {

            var code = context.request['code'];
            db.insertAnalyzeItem(createAnalyzeItem(context.request['code'], context.request['message'], "filepath"), function (err, doc) {
                if (err) {
                    console.log(err.message);
                    res.end();
                    return;
                }

                db.setAnalyzeItem(context.request['id'], doc.id, function (err, model) {
                    if (err) {
                        console.log(err.message);
                        res.end();
                        return;
                    }
                });
            });

             var json = JSON.stringify({ "code": context.request['code'], "message": context.request['message'] });
             res.end(json);
        }
    ],
        function (err) {
            if (err) {

            }
        });
}


function createAnalyzeItem(code, message, img_path) {
    var ai = new analyzelItem();
    ai.code = code;
    ai.message = message;
    ai.img_path = img_path;
    ai.created_at = new Date();
    ai.updated_at = new Date();
    return ai;
}

module.exports = router;