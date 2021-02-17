var express = require('express');
var router = express.Router();
const Room = require('../models/RoomModel');
var serverVariables = require('../server');


router.get('/', function(req,res,next) {
    (async () => {
        
        var currentRoom = await Room.getRoomByUser(req.session.user.username)
        var roomPopulation = await Room.getRoomPopulation(currentRoom)
        var roomPopulationUsernames = await Room.getRoomPopulationUsernames(currentRoom)
        var allUnansweredQuestions = await Room.getAllUnansweredQuestions(currentRoom)
        if(allUnansweredQuestions == undefined) {
            res.redirect('/endgame')
        }

        var minNumber = 20000
        for(let i = 0; i < allUnansweredQuestions.length; i++) {
            if(allUnansweredQuestions[i].id < minNumber) {
                minNumber = allUnansweredQuestions[i].id
            }
        }

        var randomQuestion = allUnansweredQuestions[minNumber].text
        var randomQuestionId = allUnansweredQuestions[minNumber].id


        res.render('question', {
            title : 'question',
            currentRoomPopulation: roomPopulation,
            currentRoomPopulationUsernames: roomPopulationUsernames,
            roomid: currentRoom,
            user: req.session.user,
            question: randomQuestion,
            questionId: randomQuestionId
        })
    })();
});

router.post('/', function(req,res,next) {
    (async () => {
        var currentRoom = await Room.getRoomByUser(req.session.user.username)
        let saveAnswer = await Room.saveAnswer(currentRoom, req.body.questionId, req.session.user.username, req.body.answer)
        var numberOfAnswers = await Room.getNumberOfAnswers(currentRoom, req.body.questionId)
        var room = await Room.fetchById(currentRoom)
        if(room.size > numberOfAnswers)
        {
            res.redirect('/wait')
        } else {
            var io = serverVariables.server
            var waitDestination = '/answers'
            io.emit('everyoneAnswered', waitDestination)
            res.redirect('/answers')
        }
    })();
});

module.exports = router;