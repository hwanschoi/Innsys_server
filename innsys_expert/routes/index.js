var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {

    if (req.session.user) { // 세션이 있으면 메인페이지 출력
        fs.readFile('./public/main.html', function (err, data) {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end(data);
        });
    } else { //세션이 없으면 로그인 페이지 
        fs.readFile("./public/login.html", function (err, data) {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end(data);
        });
    }
});

router.get('/mypage', function (req, res, next) {
    if (req.session.user) {
        fs.readFile('./public/my_geul_bogi.html', function (err, data) {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end(data);
        });
    } else { //세션이 없으면 로그인 페이지 
        fs.readFile("./public/login.html", function (err, data) {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end(data);
        });
    }
});

router.get('/myprofile', function (req, res, next) {
    if (req.session.user) {
        fs.readFile('./public/my_profile.html', function (err, data) {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end(data);
        });
    } else { //세션이 없으면 로그인 페이지 
        fs.readFile("./public/login.html", function (err, data) {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end(data);
        });
    }
});

router.get('/beautynews', function (req, res, next) {
    if (req.session.user) {
        fs.readFile('./public/beauty_news.html', function (err, data) {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end(data);
        });
    } else { //세션이 없으면 로그인 페이지 
        fs.readFile("./public/login.html", function (err, data) {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end(data);
        });
    }
});

router.get('/contact', function (req, res, next) {
    if (req.session.user) {
        fs.readFile('./public/contact.html', function (err, data) {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end(data);
        });
    } else { //세션이 없으면 로그인 페이지 
        fs.readFile("./public/login.html", function (err, data) {
            res.writeHead('200', {
                'Content-Type': 'text/html;charset=utf8'
            });
            res.end(data);
        });
    }
});

module.exports = router;