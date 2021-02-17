var express = require('express');
var router = express.Router();
const Room = require('../models/RoomModel');
const User = require('../models/UserModel');

router.get('/', function (req, res, next) {
    (async () => {

        var currentRoom = await Room.getRoomByUser(req.session.user.username)
        var currentQuestion = await Room.getCurrentQuestion(currentRoom)
        var questionText = currentQuestion[0].text
        var questionId = currentQuestion[0].id
        var roomPopulation = await Room.getRoomPopulation(currentRoom)
        var roomPopulationUsernames = await Room.getRoomPopulationUsernames(currentRoom)
        var allAnswers = await Room.getAllAnswers(currentRoom, questionId)

        var answers = {};
        var usernameAnswers = []
        var pointIndex = []
        var maxAnswers = -1


        var pointCount = 0
        var currentUser = await User.fetchByUsername(req.session.user.username)
        for (let i = 0; i < roomPopulation.length; i++) {
            usernameAnswers = [];
            currentAnswers = 0
            for (let j = 0; j < allAnswers.length; j++) {
                if (allAnswers[j].answerusername == roomPopulationUsernames[i].username) {
                    usernameAnswers.push(allAnswers[j].username)
                    currentAnswers += 1
                }
            }

            if (currentAnswers == maxAnswers) {
                pointIndex.push(i)
            } else if (currentAnswers > maxAnswers) {
                pointIndex = []
                pointIndex.push(i)
                maxAnswers = currentAnswers
            }

            answers[roomPopulationUsernames[i].username] = usernameAnswers;
        }

        console.log("Point index:")
        console.log(pointIndex)
        console.log("--------------")


        for (let i = 0; i < pointIndex.length; i++) {
            for (let j = 0; j < answers[roomPopulationUsernames[i].username].length; j++) {
                pointCount += 1
            }
        }

        console.log("Point count:")
        console.log(pointCount)
        console.log("--------------")

        console.log("Answers:")
        console.log(answers)
        console.log("Room population usernames")
        console.log(roomPopulationUsernames)
        console.log("--------------")

        for (let i = 0; i < pointIndex.length; i++) {
            for (let j = 0; j < answers[roomPopulationUsernames[pointIndex[i]].username].length; j++) {
                if (req.session.user.username == answers[roomPopulationUsernames[pointIndex[i]].username][j]) {
                    console.log("Unutra:")
                    console.log(req.session.user.username)
                    console.log("--------------")
                    var addPoints = await Room.addPoints(currentRoom, req.session.user.username, roomPopulation.length - pointCount + 1)
                }
            }
        }

        answers = {}

        for (let i = 0; i < roomPopulation.length; i++) {
            usernameAnswers = [];
            currentAnswers = 0
            for (let j = 0; j < allAnswers.length; j++) {
                if (allAnswers[j].answerusername == roomPopulationUsernames[i].username) {
                    usernameAnswers.push(allAnswers[j].firstname)
                }
            }
            answers[roomPopulationUsernames[i].username] = usernameAnswers;
        }



        res.render('answers', {
            title: 'answers',
            user: req.session.user,
            questionText: questionText,
            questionId: questionId,
            roomPopulation: roomPopulation,
            roomPopulationUsernames: roomPopulationUsernames,
            answers: answers

        })
    })();
});

module.exports = router;