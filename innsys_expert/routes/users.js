var express = require('express');
var db = require('../db.js');
var router = express.Router();
var fs = require('fs');

router.post('/', function (req, res) {

    var id = req.param('id');
    var pw = req.param('password');
    console.log(id);
    console.log(pw);

    db.authExpert(id, pw, function (err, docs) {

        if (err) throw err;

        if (docs) {

            if (docs.length == 0) {
                console.log('그런 아이디 없다 이시키야');

                res.writeHead('200', {
                    'Content-Type': 'text/html;charset=utf8'
                });
                res.end('invalid_id');
                return;
            }

            var findId = docs[0]._doc.email;
            if (findId === id) {

                var findPw = docs[0]._doc.password;
                if (findPw === pw) {
                    req.session.user = {
                        id: findId,
                    }
                    res.redirect('/');
                    // res.writeHead('200', {
                    //     'Content-Type': 'text/html;charset=utf8'
                    // });
                    res.end();
                } else {
                    console.log('비밀번호 틀렸다 이시키야');
                    res.writeHead('200', {
                        'Content-Type': 'text/html;charset=utf8'
                    });
                    res.write('invalid_pw');
                    res.end();
                }
            }
        }
    });
});

router.post('/token', function (req, res) {
    var email = req.param('email');
    var token = req.param('token');

        db.updateToken_expert(email, token, function (err, model) {
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

router.get('/join', function (req, res) {
    console.log('join~~~~~');
    fs.readFile('./views/join.html', function (err, data) {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.end(data);
    });
});

router.get('/joinComplete', function (req, res, next) {
    // var resultCode = req.param('resultCode');

    // res.writeHead('200', {
    //     'Content-Type': 'text/html;charset=utf8'
    // });
    // res.end('resultcode:' + resultCode);

    fs.readFile('./views/join_complete.html', function (err, data) {
        // var userEmail = document.getElementById('id_user_email');
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.end(data);
    });
});

router.post('/join/request', function (req, res) {

    var expertJoin = {
        'email': req.param('email'),
        'password': req.param('password'),
        'name': req.param('name'),
        'nickname': req.param('nickname'),
        'address': "수원시 권선구 호매실동",
        'auth': true,
        'interest_area': '아차산',
        'phone_number': req.param('phoneNumber'),
        'gender': req.param('gender'),
        'job': '개발자',
        'created_at': new Date(Date.now()).toISOString()
    };

    db.insertJoinExpert(expertJoin, function (err, docs) {
        if (err != null) {
            console.log(err.message);
            res.writeHead(200, {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end('fail');
            return;
        }
    });

    // success
    res.writeHead('200', {
        'Content-Type': 'text/html;charset=utf8'
    });
    res.end('success');

    // res.writeHead('200', {
    //     'Content-Type': 'text/html;charset=utf8'
    // });
    // res.write('<h2>회원가입 성공 페이지를 만들어다오.</h2>');
    // res.write('<h3>이메일 : ' + expertJoin.email + '</h3>');
    // res.write('<h3>비밀번호 : ' + expertJoin.password + '</h3>');
    // res.write('<h3>이름 : ' + expertJoin.name + '</h3>');
    // res.write('<h3>닉네임 : ' + expertJoin.nickname + '</h3>');
    // res.write('<h3>폰번호 : ' + expertJoin.phone_number + '</h3>');

    // if (expertJoin.gender === 'M')
    //     res.write('<h3>ㅅㅅ : 남자</h3>');
    // else
    //     res.write('<h3>ㅅㅅ : 여자</h3>');

    // res.end();
});

router.get('/logout', function (req, res) {
    if (req.session.user) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err.message);
            }

            console.log('logout');
            res.redirect('/');
        });
    }
});

router.post('/getuserInfo', function (req, res, next) {

    if (req.session.user == null) {
        res.end();
        return;
    }

    var expertId = req.session.user.id;
    var expertInfo;
    db.getExpertInfo(expertId, function (err, docs) {
        if (err) {
            return;
        }

        expertInfo = parseExpertInfo(docs[0]);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        var json = JSON.stringify({
            expertInfo
        });
        res.end(json);

    });
});

function parseExpertInfo(doc) {
    var ei = {};
    ei.email = doc._doc.email;
    ei.password = doc._doc.password;
    ei.nickname = doc._doc.nickname;
    ei.address = doc._doc.address;
    ei.interest_area = doc._doc.interest_area;
    ei.job = doc._doc.job;
    ei.created_at = doc._doc.created_at;
    return ei;
}

module.exports = router;