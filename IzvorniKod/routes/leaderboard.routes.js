var express = require('express');
var router = express.Router();
const Room = require('../models/RoomModel');

router.get('/', function (req, res, next) {
    (async () => {

        var currentRoom = await Room.getRoomByUser(req.session.user.username)
        var currentQuestion = await Room.getCurrentQuestion(currentRoom)
        if (currentQuestion != undefined) {
            var markAsAnswered = await Room.markQuestionAsAnswered(currentRoom, currentQuestion[0].id)
        }
        var roomPopulation = await Room.getRoomPopulation(currentRoom)
        var roomPopulationUsernames = await Room.getRoomPopulationUsernames(currentRoom)
        var points = {}
        for (let i = 0; i < roomPopulationUsernames.length; i++) {
            var score = await Room.getScore(currentRoom, roomPopulationUsernames[i].username)
            points[roomPopulationUsernames[i].username] = score[0].score
        }

        res.render('leaderboard', {
            title: 'leaderboard',
            user: req.session.user,
            points: points,
            roomPopulation: roomPopulation,
            roomPopulationUsernames: roomPopulationUsernames
        })
    })();
});

module.exports = router;