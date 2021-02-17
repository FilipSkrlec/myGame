var express = require('express');
var router = express.Router();
const Room = require('../models/RoomModel');

router.get('/', function(req,res,next) {
    (async () => {
        
        var currentRoom = await Room.getRoomByUser(req.session.user.username)
        var roomPopulation = await Room.getRoomPopulation(currentRoom)

        res.render('lobby', {
            title : 'lobby',
            currentRoomPopulation: roomPopulation,
            roomid: currentRoom,
            user: req.session.user
        })
    })();
});

module.exports = router;