var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/mymy', function (req, res, next) {
    fs.readFile('./public/innsys_mobile/html/counsel_list_mymy.html', function (err, data) {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.end(data);
    });
});

router.get('/all', function (req, res, next) {
    fs.readFile('./public/innsys_mobile/html/counsel_list_all.html', function (err, data) {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.end(data);
    });
});


module.exports = router;