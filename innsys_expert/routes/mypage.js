var express = require('express');
var async = require("async");
var db = require('../db.js');
var common = require('./common.js');
var multiparty = require('multiparty');
var router = express.Router();
var fs = require('fs');
var myRequestCounsels = [];

router.get('/getRequestCounselCount', function (req, res) {

    myRequestCounsels = [];
    if (req.session.user == null) {
        res.end();
        return;
    }
    db.getMyRequestCounsels(function (err, docs) {
        if (err) {
            res.end();
            return;
        }

        asyncMyRequestCounselCounts(req.session.user.id, docs, res, function (err) {
            if (err) {
                res.writeHead(500);
                res.end();
            } else {

            }
        });

    });
});

function asyncMyRequestCounselCounts(user_id, docs, res, callback) {

    var idx = 0;
    var count = 0;
    async.waterfall([
        function (callback) {
            for (var i = 0; i < docs.length; i++) {

                var requestId = docs[i]._doc._id.toString();
                db.getCounsels(requestId, function (err, results) {
                    if (err) {
                        console.log(err.message);
                        res.end();
                        return;
                    }

                    if (++idx == docs.length) {
                        callback(null);
                    }
                    if (results.length == 0) {
                        return;
                    }
                    myRequestCounsels.push(results[0]._doc.request_counsel_id);
                    count++;

                });
            }
        },

        function (callbakc) {
            res.send(count.toString());
            res.end();
        }
    ]);
}

router.post('/getRequestCounsels', function (req, res, next) {

    asyncMyRequestCounsels(res, function (err) {
        if (err) {
            res.writeHead(500);
            res.end();
        } else {

        }
    });
});

function asyncMyRequestCounsels(res, callback) {

    var idx = 0;
    var count = 0;
    var summaryRequestCounselItems = new Array();
    async.waterfall([
        function (callback) {
            for (var i = 0; i < myRequestCounsels.length; i++) {
                db.getRequestCounselItem(myRequestCounsels[i], function (err, result) {
                    var trc = common.parseSummaryRequestCounselItem(result[0]);
                    summaryRequestCounselItems.push(trc);

                    db.getCommentCount(trc.id, function (err, id, count, final) {
                        if (err) {
                            res.end();
                            return; 
                        }

                        for (var j = 0; j < summaryRequestCounselItems.length; j++) {
                            if (summaryRequestCounselItems[j].id == id)
                                summaryRequestCounselItems[j].comment_count = count;
                        }

                        if (++idx == myRequestCounsels.length) {
                            callback(null);
                        }
                    });                
                });
            }
        },

function (callbakc) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    var json = JSON.stringify({
        summaryRequestCounselItems
    });
    res.end(json);
}
    ]);
}

module.exports = router;