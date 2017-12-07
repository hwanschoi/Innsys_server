var express = require('express');
var async = require("async");
var db = require('../db.js');
var multiparty = require('multiparty');
var router = express.Router();
var fs = require('fs');
var uuid = require('uuid');
function expertInfo() { }
function counselItem() { }
function parseExpertInfo(doc) {
    var ei = new expertInfo();
    ei.email = doc._doc.email;
    ei.password = doc._doc.password;
    ei.nickname = doc._doc.nickname;
    return ei;
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

router.get('/logout', function (req, res) {

    if (req.session.user) {

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        req.session.destroy(function (err) {
            if (err) {
                console.log(err.message);
            }

            var json = JSON.stringify({ "code": 0, "message": "success" });
            res.end(json);
        });
    }
});

router.post('/join/auto_join', function (req, res) {

    var userJoin = {
        'email': req.param('id'),
        'password': req.param('password'),
        'nickname': req.param('id'),
        'created_at': new Date(Date.now()).toISOString(),
        'type': 'auto'
    };

    db.insertJoinUser(userJoin, function (err, docs) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        if (err != null) {
            console.log(err.message);
            //var json = JSON.stringify({ "data": [{ "result": 'fail', "message":err.message}] });
            var json = JSON.stringify({ "code": 10, "message": err.message });
            res.end(json);
            return;
        }
        //var json = JSON.stringify({ "data": [{ "result": 'ok', "message": '' }] });
        var json = JSON.stringify({ "code": 0, "message": "success" });
        res.end(json);
    });
});

router.post('/join/request', function (req, res) {

    var userJoin = {
        'email': req.param('email'),
        'password': req.param('password'),
        'nickname': req.param('nickname'),
        'interest_part': req.param('interest_part'),
        'age': req.param('age'),
        'phone_number': req.param('phone_number'),
        'gender': req.param('gender'),
        'data_transfer': req.param('data_transfer'),
        'created_at': new Date(Date.now()).toISOString(),
    };

    if (userJoin.data_transfer == "true") {

        // var oldId = '7790593652fb';
        // changeData(oldId, userJoin);

        db.findEmail(req.session.user.id, function (err, result) {

            var id = result[0]._doc._id.toString();
            var old_email = result[0]._doc.email;
            db.updateJoinUser(id, userJoin, function (err, docs) {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });

                if (err != null) {
                    console.log(err.message);
                    //var json = JSON.stringify({ "data": [{ "result": 'fail', "message":err.message}] });
                    var json = JSON.stringify({ "code": 10, "message": err.message });
                    res.end(json);
                    return;
                }
                //var json = JSON.stringify({ "data": [{ "result": 'ok', "message": '' }] });

                changeData(old_email, userJoin);
                var json = JSON.stringify({ "code": 0, "message": "success" });
                res.end(json);
            });
        });
    }
    else {
        db.insertJoinUser(userJoin, function (err, docs) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });

            if (err != null) {
                console.log(err.message);
                //var json = JSON.stringify({ "data": [{ "result": 'fail', "message":err.message}] });
                var json = JSON.stringify({ "code": 10, "message": err.message });
                res.end(json);
                return;
            }
            //var json = JSON.stringify({ "data": [{ "result": 'ok', "message": '' }] });
            var json = JSON.stringify({ "code": 0, "message": "success" });
            res.end(json);
        });
    }
});

function changeData(old_email, userJoin) {
    db.findCounsel(old_email, function (err, docs) {
        var size = docs.length;
        for (var i = 0; i < size; i++) {
            var id = docs[i]._doc._id.toString();
            db.changeIdCounsel(id, userJoin.email, userJoin.nickname, function (err, docs) {

            });
        }
    });

    db.getRequestCounselsById(old_email, function (err, docs) {
        var size = docs.length;
        for (var i = 0; i < size; i++) {
            var id = docs[i]._doc._id.toString();

            if (userJoin.gender == "F") {
                userJoin.gender = 2;
            } else
                userJoin.gender = 1;

            db.changeIdRequestCounsel(id, userJoin.email, userJoin.nickname, userJoin.interest_part, userJoin.gender, userJoin.age,
                function (err, docs) {

                });
        }
    });
}

router.post('/check_nickname', function (req, res) {
    var nickname = req.param('nickname');

    db.findNickname(nickname, function (err, docs) {

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        if (err != null) {
            console.log(err.message);
            //var json = JSON.stringify({ "data": [{ "result": 'fail', "message":err.message}] });
            var json = JSON.stringify({ "code": 10, "message": err.message });
            res.end(json);
            return;
        }

        if (docs.length > 0) {
            var json = JSON.stringify({ "code": 1, "message": 'nickname already exist' });
            res.end(json);
        }
        else {
            var json = JSON.stringify({ "code": 0, "message": 'ok' });
            res.end(json);
        }
    });
});

router.post('/check_email', function (req, res) {
    var nickname = req.param('email');

    db.findNickname(nickname, function (err, docs) {

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        if (err != null) {
            console.log(err.message);
            //var json = JSON.stringify({ "data": [{ "result": 'fail', "message":err.message}] });
            var json = JSON.stringify({ "code": 10, "message": err.message });
            res.end(json);
            return;
        }

        if (docs.length > 0) {
            var json = JSON.stringify({ "code": 1, "message": 'nickname already exist' });
            res.end(json);
        }
        else {
            var json = JSON.stringify({ "code": 0, "message": 'ok' });
            res.end(json);
        }
    });
});

router.post('/login', function (req, res) {

    var id = req.param('email');
    var pw = req.param('password');
    console.log(id);
    console.log(pw);

    db.authUsers(id, pw, function (err, docs) {

        if (err) throw err;

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        if (docs) {

            if (docs.length == 0) {
                var json = JSON.stringify({ "code": 1, "message": 'email already exist' });
                res.end(json);
                return;
            }

            var findId = docs[0]._doc.email;
            if (findId === id) {

                var findPw = docs[0]._doc.password;
                if (findPw === pw) {
                    req.session.user = { id: findId, }
                    var json = JSON.stringify({
                        "code": 0, "message": 'ok',
                        "email": docs[0]._doc.email,
                        "nickname": docs[0]._doc.nickname,
                        "interest_part": docs[0]._doc.interest_part,
                        "gender": docs[0]._doc.gender,
                        "age": docs[0]._doc.age,
                        "phone": docs[0]._doc.phone_number,
                        "profile_path": docs[0]._doc.profile_path,
                        "type": docs[0]._doc.type
                    });
                    res.end(json);

                } else {
                    var json = JSON.stringify({ "code": 2, "message": 'password is incorrect' });
                    res.end(json);
                }
            }
            else {
                var json = JSON.stringify({ "code": 3, "message": 'email does not exist' });
                res.end(json);
            }
        }
    });
});

router.post('/token', function (req, res) {
    var email = req.param('email');
    var token = req.param('token');

    db.updateToken(email, token, function (err, model) {
        if (err) {
            console.log(err.message);
            res.end();
            return;
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        var json = JSON.stringify({ "code": 0, "message": 'complete' });
        res.end(json);
    });
});

router.post('/updateRequestCounsel', function (req, res, next) {

    var id = req.param('id');
    var text = req.param('text');

    db.updateRequestCounsel(id, text, function (err, model) {
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

router.post('/updateCounsel', function (req, res, next) {

    var id = req.param('id');
    var title = req.param('title');
    var text = req.param('text');

    function counselItem() { };
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

router.post('/findid', function (req, res) {
    var nickname = req.param('nickname');
    var phoneNumber = req.param('phone_number');
    db.findNickname(nickname, function (err, docs) {

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        if (err != null) {
            console.log(err.message);
            //var json = JSON.stringify({ "data": [{ "result": 'fail', "message":err.message}] });
            var json = JSON.stringify({ "code": 10, "message": err.message });
            res.end(json);
            return;
        }

        if (docs.length > 0) {
            if (phoneNumber === docs[0]._doc.phone_number) {
                var json = JSON.stringify({ "code": 0, "message": docs[0]._doc.email });
                res.end(json);
            }
            else {
                var json = JSON.stringify({ "code": 1, "message": 'phonenumber already exist' });
                res.end(json);
            }
        }
        else {
            var json = JSON.stringify({ "code": 1, "message": 'nickname already exist' });
            res.end(json);
        }
    });
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

    var userId = req.session.user.id;

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
                if (name === "userID") {
                    //userId = value;
                }
                else
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

            var requestCounselItemId = context.request['requestCounselId'];
            var parentId = context.request['parentId'];
            if (parentId === undefined) {
                parentId = null;
            }

            var text = context.request['text'];
            var ci = new counselItem();
            var img_path = context.request['img_path'];

            var userInfo;
            db.getUserInfo(userId, function (err, docs) {
                if (err) {
                    return;
                }

                userInfo = parseExpertInfo(docs[0]);
                db.insertCounsel(createCounselItem(userInfo, requestCounselItemId, parentId, text, img_path), function (err, model) {
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
                });
            });
        }
    ],
        function (err) {
            if (err) {

            }
        });
}

router.post('/requestCounsel', function (req, res) {
    saveRequest2(req, res, function (err) {
        if (err) {
            res.writeHead(500);
            res.end();
        }
        else {

        }
    });
});

function saveRequest2(req, res, callback) {
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
                    context.request[part.name] = '/userdata/images/' + filename;
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

            context.request['analyze_id'] = null;
            db.insertrequestCounselItem(context.request, function (err, model) {
                if (err) {
                    console.log(err.message);
                    res.end();
                    return;
                }

                db.getAllTokens(function (err, docs) {
                    
                    var tokens;
                    for (var i = 0; i < 1; i++) {
                        tokens = docs[i]._doc.token;
                    }

                    var id = context.request._id.toString();
                    sendPush_expert(tokens, id);
                });

                //var counselItem = parseCounselItem(model);
                var json = JSON.stringify({ "code": 1, "message": 'complete' });
                res.end(json);
            });
        }
    ],
        function (err) {
            if (err) {

            }
        });
}

function sendPush_expert(tokens, requestCounselItemId) {

    var FCM = require('fcm-push');

    var serverKey = 'AAAAnmpmnng:APA91bGxnG_K1yF-zhpzd-F1U-l0rwBIgtI779DPZ8EiY7CuQWU-3I0qc6JqH_JurRsrGNvh9f1Hji7-V1snYc8tKYGewHCTOSMtMUevtf_Puk7rqVJA5PbxowL4NzpwgYHhBrypASwp';    
    var fcm = new FCM(serverKey);
    var message =
        {
            registration_ids: [tokens],
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

router.post('/edituserinfo', function (req, res, next) {

    var email = req.param('email');
    var age = req.param('age');
    var gender = req.param('gender');
    var interest = req.param('interest');
    var phone_number = req.param('phone_number');
    var profile_path = req.param('profile_path');

    function counselItem() { };
    var ci = new counselItem();
    //email, nickname, interrest, sex, age, phone
    db.updateUserInfo(email, age, gender, interest, phone_number, profile_path, function (err, model) {
        if (err) {
            console.log(err.message);
            res.end();
            return;
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        var json = JSON.stringify({ "code": 0, "message": 'complete' });
        res.end(json);
    });
});


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4();
}

router.get('/get_unique_id', function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    var json = JSON.stringify({ "result": guid() });
    res.end(json);
});

function createCounselItem(userInfo, requestCounselItemId, parentId, text, img_path) {
    var ci = new counselItem();
    ci.request_counsel_id = requestCounselItemId;
    ci.parent_id = parentId;
    ci.expert_id = userInfo.email;
    ci.expert_nick = userInfo.nickname;
    ci.img_path = img_path;
    ci.text = text;
    ci.created_at = new Date();
    ci.updated_at = new Date();
    ci.attach_file = "";
    return ci;
}


module.exports = router;