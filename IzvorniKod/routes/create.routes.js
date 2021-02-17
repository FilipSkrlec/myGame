var express = require('express');
var router = express.Router();
const Room = require('../models/RoomModel');

router.get('/', function(req,res,next) {
    res.render('create', {
        title : 'Create',
        id: undefined,
        user: req.session.user
    })
});

router.post('/', function(req,res,next) {
    (async () => {
        var str = await Room.generateId()
        room = new Room(str, req.body.size)
        let inserted = await Room.enterNewRoom(room)

        res.render('create', {
            title : 'Create',
            id: str,
            user: req.session.user
        })
    })();
});



module.exports = router;