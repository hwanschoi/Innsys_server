var express = require('express');
var db = require('../db.js');
var router = express.Router();
var fs = require('fs');

router.post('/', function(req, res) {

    var id = req.param('id');
    var pw = req.param('password');
    console.log(id);
    console.log(pw);

    db.authUser(id, pw, function(err, docs) {

        if (err) throw err;

        if (docs) {

            if (docs.length == 0) {
                console.log('그런 아이디 없다 이시키야');

                res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                res.write('<h1>그런 아이디 없다 이시키야</h1>');
                res.end();
                return;
            }

            var findId = docs[0]._doc.id;
            if (findId === id) {

                var findPw = docs[0]._doc.password;
                if (findPw === pw) {
                    fs.readFile('../public/main.html', function(err, data) {
                        res.writeHead('200', {
                            'Content-Type': 'text/html;charset=utf8'
                        });
                        res.end(data);
                    });

                } else {
                    console.log('비밀번호 틀렸다 이시키야');
                    res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
                    res.write('<h1>비밀번호 틀렸다 이시키야</h1>');
                    res.end();
                }
            }
        }
    });
});


router.post('/join', function(req, res) {
    console.log('join~~~~~');
    fs.readFile('../views/join.html', function(err, data) {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.end(data);
    });
});

router.post('/join/request', function(req, res) {

    var userJoin = {
        'id': req.param('id'),
        'password': req.param('password'),
        'name': req.param('name'),
        'nickname': req.param('nickname'),
        'email': req.param('email'),
        'address': "수원시 권선구 호매실동",
        'auth': true,
        'interest_area': '아차산',
        'phone_number': req.param('phoneNumber'),
        'gender': req.param('gender'),
        'job': '개발자',
        'created_at': new Date(Date.now()).toISOString()
    };

    db.insertJoin(userJoin, function(err, docs) {
        if (err != null) {
            console.log(err.message);
        }
    });

    res.writeHead('200', { 'Content-Type': 'text/html;charset=utf8' });
    res.write('<h2>회원가입 성공 페이지를 만들어다오.</h2>');
    res.write('<h3>아이디 : ' + userJoin.id + '</h3>');
    res.write('<h3>비밀번호 : ' + userJoin.password + '</h3>');
    res.write('<h3>이름 : ' + userJoin.name + '</h3>');
    res.write('<h3>닉네임 : ' + userJoin.nickname + '</h3>');
    res.write('<h3>이메일 : ' + userJoin.email + '</h3>');
    res.write('<h3>폰번호 : ' + userJoin.phone_number + '</h3>');

    if (userJoin.gender === 'M')
        res.write('<h3>ㅅㅅ : 남자</h3>');
    else
        res.write('<h3>ㅅㅅ : 여자</h3>');

    res.end();
});

module.exports = router;