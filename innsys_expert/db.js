var mongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var database;
var expertSchema;
var expertModel;
var userSchema;
var userModel;
var RequestCounselSchema;
var RequestCounselModel;
var CounselSchema;
var CounselModel;
var analyzeModel;

exports.connectDB = function () {
    var databseUrl = 'mongodb://localhost:27017/innsys_expert';

    mongoose.Promise = global.Promise;
    mongoose.connect(databseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error.'));
    database.on('open', function () {
        console.log('mongodb open');

        makeExpertSchema();
        makeUserSchema();
        makeRequestCounselItem();
        makeCounselItem();
        makeAnalyzeItem();

        //test
        // var fs = require('fs');
        // var obj;
        // fs.readFile('./test/testdb.json', 'utf8', function(err, data) {
        //     if (err) throw err;
        //     obj = JSON.parse(data);

        //     for (var i = 0; i < obj.length; i++) {
        //         var a = obj[i];
        //         insertDB(a, function(err, docs) {
        //             //var id = docs[0]._id;
        //         });
        //     }
        // });
    });

    database.on('disconnect', function () {
        console.log('mongodb disconnect');
    });
};

function makeExpertSchema() {
    expertSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        token: {
            type: String,
        },
        name: {
            type: String
        },
        nickname: {
            type: String,
            required: true
        },
        address: {
            type: String
        },
        auth: {
            type: Boolean
        },
        interest_area: {
            type: String
        },
        phone_number: {
            type: String
        },
        gender: {
            type: String
        },
        job: {
            type: String
        },
        created_at: {
            type: Date,
            index: {
                unique: false,
                'default': Date.now
            }
        },
        updated_at: {
            type: Date,
            index: {
                unique: false,
                'default': Date.now
            }
        }
    });

    expertSchema.static('findById', function (_email, callback) {
        return this.find({
            email: _email
        }, callback);
    });

    expertSchema.static('findAll', function (callback) {
        return this.find({}, callback);
    });

    expertSchema.static('updateToken', function (email, token, callback) {
        return this.where({ email: email }).update({
            token: token
        }, callback);
    });

    expertModel = mongoose.model("experts", expertSchema);
}

function makeRequestCounselItem() {
    RequestCounselSchema = new mongoose.Schema({
        user_id: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            required: true
        },
        name: {
            type: String,
        },
        title: {
            type: String,
        },
        created_at: {
            type: Date,
            index: {
                unique: false,
                'default': Date.now
            }
        },
        updated_at: {
            type: Date,
            index: {
                unique: false,
                'default': Date.now
            }
        },
        text: {
            type: String
        },
        img_white_path: {
            type: String
        },
        img_ir_path: {
            type: String
        },
        img_uv_path: {
            type: String
        },
        img_attach_path: {
            type: String
        },
        img_thumbnail_path: {
            type: String
        },
        measure_part: {
            type: String
        },
        sex: {
            type: Number
        },
        age: {
            type: Number
        },
        analyze_id: {
            type: String
        }
    });

    RequestCounselSchema.static('findById', function (id, callback) {
        return this.find({
            _id: id
        }, callback);
    });

    RequestCounselSchema.static('count', function (callback) {
        return this.find({}, callback).count();
    });

    RequestCounselSchema.static('findPage', function (pageIdx, callback) {
        if (pageIdx == 0)
            return this.find({}, callback).sort({ $natural: -1 }).limit(9);
        else {
            pageIdx = pageIdx * 9;
            return this.find({}, callback).sort({ $natural: -1 }).skip(pageIdx).limit(9);
        }
    });

    RequestCounselSchema.static('findAll', function (pageIdx, callback) {
        return this.find({}, callback);
    });

    RequestCounselSchema.static('findAllById', function (userId, callback) {
        return this.find({ user_id: userId }, callback);
    });

    RequestCounselSchema.static('getEmptyAnalysis', function (callback) {
        return this.find({ analyze_id: null }, callback);
    });

    RequestCounselSchema.static('getAll', function (callback) {
        return this.find({}, callback);
    });

    RequestCounselSchema.static('update', function (id, _text, _updated_at, callback) {
        return this.where({ _id: id }).update({ text: _text, updated_at: _updated_at }, callback);
    });

    RequestCounselSchema.static('setAnalyze', function (id, analyzeId, callback) {
        return this.where({ _id: id }).update({ analyze_id: analyzeId }, callback);
    });

    RequestCounselSchema.static('updateUserInfo', function (_id, email, nickname, interrest, sex, age, callback) {
        return this.where({ _id: _id }).update({
            user_id: email,
            nickname: nickname,
            interrest: interrest,
            sex: sex,
            age: age
        }, callback);
    });

    RequestCounselModel = mongoose.model("request_counsel", RequestCounselSchema);
}

function makeCounselItem() {
    CounselSchema = new mongoose.Schema({

        request_counsel_id: {
            type: String,
            required: true
        },
        expert_id: {
            type: String,
            required: true
        },
        expert_nick: {
            type: String,
            required: true
        },
        title: {
            type: String,
        },
        text: {
            type: String,
        },
        parent_id: {
            type: String,
        },
        img_path: {
            type: String,
        },
        created_at: {
            type: Date,
            index: {
                unique: false,
                'default': Date.now
            }
        },
        updated_at: {
            type: Date,
            index: {
                unique: false,
                'default': Date.now
            }
        },
        attach_file: {
            type: String
        }
    });

    CounselSchema.static('findById', function (id, callback) {
        return this.find({
            expert_id: id
        }, callback);
    });

    CounselSchema.static('count', function (id, callback) {
        return this.find({
            id: id
        }, callback).count();
    });

    CounselSchema.static('findByRequestCounselId', function (requestCounselId, callback) {
        return this.find({
            request_counsel_id: requestCounselId
        }, callback);
    });

    CounselSchema.static('getCommentCount', function (requestCounselId, callback) {
        return this.find({
            request_counsel_id: requestCounselId
        }, callback).count();
    });

    CounselSchema.static('findAll', function (callback) {
        return this.find({}, callback);
    });

    CounselSchema.static('update', function (id, _title, _text, callback) {
        return this.where({ _id: id }).update({ title: _title, text: _text }, callback);
    });

    CounselSchema.static('updateUserInfo', function (id, _expert_id, _expert_nick, callback) {
        return this.where({ _id: id }).update({ expert_id: _expert_id, expert_nick: _expert_nick }, callback);
    });

    CounselSchema.static('remove', function (id, callback) {
        return this.where({ _id: id }).remove(callback);
    });

    CounselModel = mongoose.model("counsels", CounselSchema);
}

function makeUserSchema() {
    userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        token: {
            type: String,
        },
        nickname: {
            type: String,
            required: true
        },
        age: {
            type: String
        },
        phone_number: {
            type: String
        },
        gender: {
            type: String
        },
        interest_part: {
            type: String
        },
        type: {
            type: String //auto, manual
        },
        profile_path: {
            type: String
        },
        created_at: {
            type: Date,
            index: {
                unique: false,
                'default': Date.now
            }
        },
        updated_at: {
            type: Date,
            index: {
                unique: false,
                'default': Date.now
            }
        }
    });

    userSchema.static('findById', function (_email, callback) {
        return this.find({
            email: _email
        }, callback);
    });

    userSchema.static('findAll', function (callback) {
        return this.find({}, callback);
    });

    userSchema.static('findByNickname', function (_nickname, callback) {
        return this.find({
            nickname: _nickname
        }, callback);
    });

    userSchema.static('findByEmail', function (_email, callback) {
        return this.find({
            email: _email
        }, callback);
    });

    userSchema.static('updateUserInfo2', function (email, age, gender, interest, phone_number, profile_path, callback) {
        return this.where({ email: email }).update({
            interest_part: interest,
            gender: gender,
            phone_number: phone_number,
            profile_path: profile_path,
            age: age
        }, callback);
    });

    userSchema.static('updateToken', function (email, token, callback) {
        return this.where({ email: email }).update({
            token: token
        }, callback);
    });

    userSchema.static('updateUserInfo', function (id, userInfo, callback) {
        return this.where({ _id: id }).update(
            {
                email: userInfo.email,
                password: userInfo.password,
                nickname: userInfo.nickname,
                phone_number: userInfo.phone_number,
                gender: userInfo.gender,
                interest_part: userInfo.interest_part,
                type: 'manual',
                created_at: userInfo.created_at,
            }, callback);
    });

    userModel = mongoose.model("users", userSchema);
}

function makeAnalyzeItem() {

    AnalyzeItemSchema = new mongoose.Schema({
        code: {
            type: String
        },
        message: {
            type: String
        },
        img_path: {
            type: String
        },
        created_at: {
            type: Date,
            index: {
                unique: false,
                'default': Date.now
            }
        },
        updated_at: {
            type: Date,
            index: {
                unique: false,
                'default': Date.now
            }
        }
    });

    analyzeModel = mongoose.model("analyze_item", AnalyzeItemSchema);
}

exports.authUsers = function (email, password, callback) {
    //var experts = database.collection('experts');

    userModel.findById(email, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, results);
    });
};

exports.authExpert = function (email, password, callback) {
    //var experts = database.collection('experts');

    expertModel.findById(email, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, results);
    });
};

exports.getExpertInfo = function (email, callback) {

    expertModel.findById(email, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, results);
    });
};

exports.getAllTokens = function (callback) {

    expertModel.findAll(function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, results);
    });
};

exports.getUserInfo = function (email, callback) {

    userModel.findById(email, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, results);
    });
};

exports.insertJoinExpert = function (joinInfo, callback) {

    var expert = new expertModel(joinInfo);

    expert.save(function (err) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, expert);
    });
};

exports.insertJoinUser = function (joinInfo, callback) {

    var user = new userModel(joinInfo);

    user.save(function (err) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, user);
    });
};

exports.updateJoinUser = function (id, joinInfo, callback) {

    userModel.updateUserInfo(id, joinInfo, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, result);
    });
};

exports.updateUserInfo = function (email, age, gender, interest, phone_number, profile_path, callback) {

    userModel.updateUserInfo2(email, age, gender, interest, phone_number, profile_path, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, result);
    });
};

exports.updateToken = function (email, token, callback) {

    userModel.updateToken(email, token, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, result);
    });
};

exports.updateToken_expert = function (email, token, callback) {

    expertModel.updateToken(email, token, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, result);
    });
};

exports.findNickname = function (nickname, callback) {
    userModel.findByNickname(nickname, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, results);
    });
};

exports.findEmail = function (email, callback) {
    userModel.findByEmail(email, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, results);
    });
};

exports.insertrequestCounselItem = function (requestCounselItem, callback) {

    RequestCounselModel.created_at = new Date();
    RequestCounselModel.collection.insert(requestCounselItem, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, result);
    });
};

function insertDB2(CounselItem, callback) {

    var model = new CounselModel(CounselItem);

    model.save(function (err) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, model);
    });
};

exports.getRequestCounselCount = function (callback) {

    RequestCounselModel.count(function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        //console.dir(results);
        callback(null, results.length);
    });
};

exports.getRequestCounsels = function (pageIdx, callback) {

    if (pageIdx === "") {
        RequestCounselModel.findAll(pageIdx, function (err, results) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.dir(results);
            callback(null, results);
        });
    } else {
        RequestCounselModel.findPage(pageIdx, function (err, results) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.dir(results);
            callback(null, results);
        });
    }
};

exports.getRequestCounselsById = function (userid, callback) {

    RequestCounselModel.findAllById(userid, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }

        console.dir(results);
        callback(null, results);
    });
};

exports.getMyRequestCounsels = function (callback) {

    RequestCounselModel.getAll(function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }

        console.dir(results);
        callback(null, results);
    });
};

exports.getRequestCounselItem = function (id, callback) {

    RequestCounselModel.findById(id, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, results);
    });
};

exports.getEmptyAnalyseRequestCounselItem = function (callback) {

    RequestCounselModel.getEmptyAnalysis(function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, results);
    });
};

exports.updateRequestCounsel = function (id, text, callback) {

    var upateDate = new Date();
    RequestCounselModel.update(id, text, upateDate, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, 'ok');
    });
};

exports.changeIdRequestCounsel = function (id, email, nickname, interrest, sex, age, callback) {

    var upateDate = new Date();
    RequestCounselModel.updateUserInfo(id, email, nickname, interrest, sex, age, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, 'ok');
    });
};

exports.setAnalyzeItem = function (requestCounselId, analyzeId, callback) {

    RequestCounselModel.setAnalyze(requestCounselId, analyzeId, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, 'ok');
    });
};

exports.getCounsels = function (requestCounselId, callback) {

    CounselModel.findByRequestCounselId(requestCounselId, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, results);
    });
};


exports.insertCounsel = function (counselItem, callback) {

    var model = new CounselModel(counselItem);
    model.save(function (err) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, model);
    });
};

exports.updateCounsel = function (id, title, text, callback) {

    CounselModel.update(id, title, text, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, 'ok');
    });
};

exports.changeIdCounsel = function (id, title, text, callback) {

    CounselModel.updateUserInfo(id, title, text, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, 'ok');
    });
};

exports.removeCounsel = function (id, callback) {

    CounselModel.remove(id, function (err, results) {
        if (err) {
            console.log(err.message);
            return;
        }
        console.dir(results);
        callback(null, 'ok');
    });
};

exports.findCounsel = function (parentId, callback) {

    CounselModel.findById(parentId, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, result);
    });
};

exports.findCounselMyEmail = function (parentId, callback) {

    CounselModel.findByEmail(parentId, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, result);
    });
};

exports.getCommentCount = function (id, callback) {
    CounselModel.getCommentCount(id, function (err, result) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, id, result.length);
    });
};


exports.insertAnalyzeItem = function (analyzeItem, callback) {

    var model = new analyzeModel(analyzeItem);
    model.save(function (err) {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, model);
    });
};