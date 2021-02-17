var express = require('express');
var router = express.Router();
const Room = require('../models/RoomModel');

router.get('/', function(req,res,next) {
    res.render('menu', {
        title : 'Menu',
        user: req.session.user
    })
});

router.post('/', function(req,res,next) {
    (async () => {
        let join = await Room.joinRoom(req.body.roomCode, req.session.user.username)
        let leaderboard = await Room.joinRoomLeaderboard(req.body.roomCode, req.session.user.username)
        res.redirect('/lobby')
    })();
});

module.exports = router;