var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('home');      
});

module.exports = router;