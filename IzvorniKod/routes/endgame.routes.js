var express = require('express');
var router = express.Router();
const Room = require('../models/RoomModel');

router.get('/', function(req,res,next) {
    res.render('endgame', {
        title : 'endgame',
        user: req.session.user
    })
});

module.exports = router;