var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/getdetail', function(req, res) {

    var id = req.param('dataID');
    res.redirect('/process/detail/counsel_item/?dataID=' + id);
});


router.get('/counsel_item', function(req, res) {

    fs.readFile("./public/item_detail.html", function(err, data) {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.end(data);
    });
});

router.get('/getdetailmobile', function(req, res) {

    var id = req.param('dataID');
    res.redirect('/process/detail/counsel_item_mobile/?dataID=' + id);
});


router.get('/counsel_item_mobile', function(req, res) {

    fs.readFile("./public/innsys_mobile/html/detail_page.html", function(err, data) {
        res.writeHead('200', {
            'Content-Type': 'text/html;charset=utf8'
        });
        res.end(data);
    });
});

module.exports = router;