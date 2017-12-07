var express = require('express');
var async = require("async");
var db = require('../db.js');
var multiparty = require('multiparty');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');

function userInfo() { }
function summaryRequestCounselItem() { }
function counselItem() { }
function expertInfo() { }

router.get('/getRequestCounselCount', function (req, res) {
    db.getRequestCounselCount(function (err, count) {
        if (err) {
            res.end();
            return;
        }
        res.send(count.toString());
        res.end();
    });
});

router.post('/getRequestCounsels', function (req, res, next) {

    var param = req.param('pageIdx');
    var userid = req.param('userID');
    var filter = req.param('filter');
    var idx = "";
    if (param != "") {
        idx = param - 1;
    }

    if (userid == null || userid == undefined) {
        userid = "";
    }

    if (filter === undefined) {
        filter = "전체";
    }

    if (userid != "") {
        db.getRequestCounselsById(userid, function (err, docs) {
            if (err) {
                res.end();
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            asyncRequestCounsels(docs, res, function (err) {
                if (err) {
                    res.writeHead(500);
                    res.end();
                }
                else {

                }
            });
        });
    }
    else {
        db.getRequestCounsels(idx, function (err, docs) {
            if (err) {
                res.end();
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            asyncRequestCounsels_filter(docs, res, filter, function (err) {
                if (err) {
                    res.writeHead(500);
                    res.end();
                }
                else {

                }
            });
        });
    }


});

function asyncRequestCounsels(docs, res, callback) {

    var summaryRequestCounselItems = new Array();
    var idx = 0;
    async.waterfall([
        function (callback) {
            for (var i = 0; i < docs.length; i++) {
                var trc = parseSummaryRequestCounselItem(docs[i]);
                summaryRequestCounselItems.push(trc);
                db.getCommentCount(summaryRequestCounselItems[i].id, function (err, id, result, final) {
                    if (err) {
                        res.end();
                        return;
                    }

                    for (var j = 0; j < summaryRequestCounselItems.length; j++) {
                        if (summaryRequestCounselItems[j].id == id)
                            summaryRequestCounselItems[j].comment_count = result;
                    }

                    if (++idx == docs.length) {
                        callback(null);
                    }
                });
            }
        },

        function (callbakc) {
            var json = JSON.stringify({
                summaryRequestCounselItems
            });
            res.end(json);
        }
    ]);
}

function asyncRequestCounsels_filter(docs, res, filter, callback) {

    var summaryRequestCounselItems = new Array();
    var idx = 0;
    var real_idx = 0;

    if (filter === undefined) {
        filter = "전체";
    }

    async.waterfall([
        function (callback) {
            for (var i = 0; i < docs.length; i++) {
                var trc = parseSummaryRequestCounselItem(docs[i]);

                if (filter === "전체") {

                } else if (filter != trc.measure_part) {
                    idx++;
                    continue;
                }

                summaryRequestCounselItems.push(trc);
                db.getCommentCount(summaryRequestCounselItems[real_idx++].id, function (err, id, result, final) {
                    if (err) {
                        res.end();
                        return;
                    }

                    for (var j = 0; j < summaryRequestCounselItems.length; j++) {
                        if (summaryRequestCounselItems[j].id == id)
                            summaryRequestCounselItems[j].comment_count = result;
                    }

                    if (++idx == docs.length) {
                        callback(null);
                    }
                });
            }
        },

        function (callbakc) {
            var json = JSON.stringify({
                summaryRequestCounselItems
            });
            res.end(json);
        }
    ]);
}

router.get('/getDetailRequestCounselItem', function (req, res, next) {
    var id = req.param('id');

    db.getRequestCounselItem(id, function (err, docs) {
        if (err) {
            console.log(err.message);
            res.end();
            return;
        }

        if (docs.length == 0) {
            console.log('docs length == 0');
            res.end();
            return;
        }

        var requestCounselItem = docs[0]._doc;

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        var json = JSON.stringify({
            requestCounselItem
        });
        res.end(json);
    });
});

router.get('/getCounsels', function (req, res, next) {
    var requestCounselItemId = req.param('requestCounselId');

    db.getCounsels(requestCounselItemId, function (err, docs) {
        if (err) {
            console.log(err.message);
            res.end();
            return;
        }

        if (docs.length == 0) {
            console.log('docs length == 0');
            res.end();
            return;
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        var CounselItems = new Array();
        for (var i = 0; i < docs.length; i++) {
            var trc = parseCounselItem(docs[i]);
            trc.my_counsel = false;
            if (req.session.user != null) {
                if (trc.expert_id == req.session.user.id) {
                    trc.my_counsel = true;
                }
            }
            CounselItems.push(trc);
        }

        sortRecursive(CounselItems);
        CounselItems.sortOn("depth");


        var roots = [];
        for (var i = 0; i < CounselItems.length; i++) {
            var doc = CounselItems[i];
            var ref_children = [];

            var existChild = false;
            for (var j = 0; j < CounselItems.length; j++) {
                var child = CounselItems[j]; // <-- here's where you need the dictionary
                if (doc.id == child.parentId) {
                    ref_children.push(child);
                    existChild = true;
                }
            }
            if (existChild == true)
                doc.children = ref_children;

            if (doc.depth == 0)
                roots.push(doc);
        }

        var json = JSON.stringify(roots);
        res.end(json);
    });
});

Array.prototype.sortOn = function (key) {
    this.sort(function (a, b) {
        if (a[key] < b[key]) {
            return -1;
        } else if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });
}

function sortRecursive(CounselItems) {
    if (isComplete(CounselItems) == true) {
        return;
    }

    for (var i = 0; i < CounselItems.length; i++) {
        if (CounselItems[i].parentId === undefined && CounselItems[i].depth === -1) {
            CounselItems[i].depth = 0;
            continue;
        }

        var parentDepth = findParent(CounselItems[i].parentId, CounselItems);
        CounselItems[i].depth = parentDepth + 1;
    }

    sortRecursive(CounselItems);
}

function isComplete(CounselItems) {
    for (var i = 0; i < CounselItems.length; i++) {
        if (CounselItems[i].depth === -1) {
            return false;
        }
    }
    return true;
}

function findParent(parentId, CounselItems) {
    for (var i = 0; i < CounselItems.length; i++) {
        if (CounselItems[i].id === parentId) {
            return CounselItems[i].depth;
        }
    }

    return -1;
}

var _promise = function (parentId) {

    return new Promise(function (resolve, reject) {

        // 비동기를 표현하기 위해 setTimeout 함수를 사용 
        db.findCounsel(parentId, function (err, result) {
            if (err) {
                reject(Error("실패!!"));
            } else {
                resolve(result);
            }
        });
    });
};
//writeCounselComment
router.post('/writeCounselComment', function (req, res, next) {
    var userId = req.session.user.id;
    var requestCounselItemId = req.param('requestCounselId');
    var parentId = req.param('parentId');
    var text = req.param('text');

    _promise(parentId)
        .then(function (text) {

        }, function (error) {

        })
});

router.post('/writeCounsel', function (req, res, next) {
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
    if (req.session.user == null) {
        res.end();
        return;
    }

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
                var writeStream = fs.createWriteStream('public/userdata/images/' + filename);
                writeStream.filename = filename;
                part.pipe(writeStream);
                part.on('data', function (chunk) {
                    console.log(filename + ' read ' + chunk.length + 'bytes');
                });
                part.on('end', function () {
                    console.log(filename + ' Part read complete');
                    writeStream.end();
                    context.request['img_path'] = 'public/userdata/images/' + filename;
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

            var expertId = req.session.user.id;
            var requestCounselItemId = context.request['requestCounselId'];
            var parentId = context.request['parentId'];
            if (parentId === undefined) {
                parentId = null;
            }

            var text = context.request['text'];
            var ci = new counselItem();
            var img_path = context.request['img_path'];

            var expertInfo;
            db.getExpertInfo(expertId, function (err, docs) {
                if (err) {
                    return;
                }

                expertInfo = parseExpertInfo(docs[0]);
                db.insertCounsel(createCounselItem(expertInfo, requestCounselItemId, parentId, text, img_path), function (err, model) {
                    if (err) {
                        console.log(err.message);
                        res.end();
                        return;
                    }

                    var counselItem = parseCounselItem(model);
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    var json = JSON.stringify({
                        counselItem
                    });
                    res.end(json);

                    db.getRequestCounselItem(requestCounselItemId, function (err, docs) {
                        if (err) {
                            console.log(err.message);
                            res.end();
                            return;
                        }

                        if (docs.length == 0) {
                            consoel.log('docs length == 0');
                            res.end();
                            return;
                        }

                        var requestCounselItem = docs[0]._doc;
                        var id = requestCounselItem.user_id
                        db.getUserInfo(id, function (err, docs) {
                            if (err) {
                                console.log(err.message);
                                res.end();
                                return;
                            }

                            var user = docs[0]._doc;
                            sendPush(user.token, requestCounselItemId);
                        });
                        
                    });

                });
            });
        }
    ],
        function (err) {
            if (err) {

            }
        });
}

function sendPush(token, requestCounselItemId) {

    var FCM = require('fcm-push');    
    var serverKey = 'AAAAtEKGIiU:APA91bEHSUXMuPz7j5NOq-z2xCUwgyH_U4w4fO-eYNxvc1XJz5TXU7y6-tY_1jRQyzck6liarJUCJWosgNlBFSfw4Zv_UaSqp6SOzYjUu2DaOWTB0rw09i471jMnuhDrffDcyEcMB_yM';
    var fcm = new FCM(serverKey);
    var message =
        {
            registration_ids: [token],
            data: {
                body: requestCounselItemId,
                title: 'title title',
                sound: ''
            },
        }; //callback style 
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
            console.log(err);
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
}

router.post('/writeCounsel', function (req, res, next) {
    if (req.session.user == null) {
        res.end();
        return;
    }

});

router.post('/updateCounsel', function (req, res, next) {
    if (req.session.user == null) {
        res.end();
        return;
    }

    var id = req.param('id');
    var title = req.param('title');
    var text = req.param('text');

    var ci = new counselItem();

    db.updateCounsel(id, title, text, function (err, model) {
        if (err) {
            console.log(err.message);
            res.end();
            return;
        }

        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.end(model);
    });
});

router.post('/removeCounselComment', function (req, res, next) {
    if (req.session.user == null) {
        res.end();
        return;
    }

    var id = req.param('counselItemId');

    db.removeCounsel(id, function (err, model) {
        if (err) {
            console.log(err.message);
            res.end();
            return;
        }

        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.end(model);
    });
});

router.post('/push_test', function (req, res, next) {
    if (req.session.user == null) {
        res.end();
        return;
    }

    var username = req.param('username');
    var username2 = req.param('username2');
    var username3 = req.param('username3');

    var FCM = require('fcm-push');
    //var serverKey = 'AAAAUykXZEQ:APA91bGXbWc0030t9_HY1QqcXS8z9NSO2Ad8hAGoh9fGVIM7feuFjcR5707IsTQQcm5Esf_3TAJ0xgTK3XtxP6UIbEp5vcXherhiT2QC_8GIlguwGFUsybimJWYU-GoabuCdtohQkHC8 ';
    var serverKey = 'AAAAtEKGIiU:APA91bEHSUXMuPz7j5NOq-z2xCUwgyH_U4w4fO-eYNxvc1XJz5TXU7y6-tY_1jRQyzck6liarJUCJWosgNlBFSfw4Zv_UaSqp6SOzYjUu2DaOWTB0rw09i471jMnuhDrffDcyEcMB_yM';
    var fcm = new FCM(serverKey);
    var message =
        {
            registration_ids: ['cWlid2Sv2zI:APA91bEsGDc6HsQSLJf1SgegwBB-rWUtPMtLmzLIk7jVgMNrDyO7WsE4hvmi0hAbIYzIa5OVE-UZFRRvDCthT0Vy4mAfOlzYzyE5asu_y_NRzrhrxAv1JRtd1oux3FlctkhdZR2lcHBU',
                'cOEVxqxIkuw:APA91bFywHvwP-SPZeYZU-Y6tJ5CV67iJ7zqykL3-ey8faGDdHqDwCoMT6tXkwzPOsZauhfxxgd71xxpsXoq9TfmPO-djNpXc_w9A7GAPG4WNH3JWoVdlpd8CGpcs83Dp7_ItiXkNi71',
                'ckRvmD_lAnE:APA91bHIsNDi8qMYnDmp5Rm7lhw-rfP6wd81s-BUNNQAwpqxvWSCSIMka7tNLJ1sWEX4dxodMoDZIfCC7CIWnjpKAND5nOyXo0I7P2DLedlxHRlxbwZ2Bv0Xy6h8WDpkc43CmXkhUGSh',
                'ezykJy338FU:APA91bFT3922WoDetryQLU08iqkt3hDnTTAvoY8kagsIqSMbmhMp5CLFviAErqpZclrJLu_J1seVCMqzHba2r_phu3b1JPnqIf_Jms2J6o13r0mj0LzDqM6Tz5nhoPdfx-g_3OG09hzn'],
            data: {
                body: 'no body',
                title: 'title title',
                sound: ''
            },
        }; //callback style 
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
            console.log(err);
        } else {
            console.log("Successfully sent with response: ", response);

            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end();
        }
    });
});


function parseuserInfo(doc) {
    var ui = new userInfo();
    ui.id = doc._doc.id;
    ui.password = doc._doc.password;
    ui.name = doc._doc.name;
    ui.nickname = doc._doc.nickname;
    ui.email = doc._doc.email;
    ui.address = doc._doc.address;
    ui.auth = doc._doc.auth;
    ui.interest_area = doc._doc.interest_area;
    ui.phone_number = doc._doc.phone_number;
    ui.gender = doc._doc.gender;
    ui.job = doc._doc.job;
    ui.created_at = doc._doc.created_at;
    ui.updated_at = doc._doc.updated_at;

    return ui;
}

function parseExpertInfo(doc) {
    var ei = new expertInfo();
    ei.email = doc._doc.email;
    ei.password = doc._doc.password;
    ei.nickname = doc._doc.nickname;
    return ei;
}

function parseSummaryRequestCounselItem(doc) {
    var trc = new summaryRequestCounselItem();
    trc.id = doc._doc._id.toString();
    trc.user_id = doc._doc.user_id;
    trc.name = doc._doc.name;
    trc.nickname = doc._doc.nickname;
    trc.title = doc._doc.title;
    trc.age = doc._doc.age;
    var moment = require('moment');
    
    var theDate = new Date(doc._doc.date_time * 1000);
    
    trc.created_at = theDate.toGMTString();
    trc.measure_part = doc._doc.measure_part;
    trc.text = doc._doc.text;
    trc.img_thumbnail_path = doc._doc.img_thumbnail_path;
    return trc;
}

function parseCounselItem(model) {
    var ci = new counselItem();
    ci.id = model._id.toString();
    ci.request_counsel_id = model.request_counsel_id;
    ci.parentId = model.parent_id;
    ci.expert_id = model.expert_id;
    ci.expert_nick = model.expert_nick;
    ci.title = model.title;
    ci.text = model.text;
    ci.img_path = model.img_path;
    ci.created_at = model.created_at;
    ci.updated_at = model.modify_date;
    ci.attach_file = model.attach_file;
    ci.depth = -1;
    return ci;
}

function createCounselItem(expertInfo, requestCounselItemId, parentId, text, img_path) {
    var ci = new counselItem();
    ci.request_counsel_id = requestCounselItemId;
    ci.parent_id = parentId;
    ci.expert_id = expertInfo.email;
    ci.expert_nick = expertInfo.nickname;
    ci.img_path = img_path;
    ci.text = text;
    ci.created_at = new Date();
    ci.updated_at = new Date();
    ci.attach_file = "";
    return ci;
}

module.exports = router;