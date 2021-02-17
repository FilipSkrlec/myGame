var express = require('express');
var router = express.Router();
var eventEmitter = require('events');
const User = require('../models/UserModel');

router.get('/', function(req,res,next) {

    res.render('home', {
        title : 'Home',
    })
});

router.post('/', function(req,res,next) {
    (async () => {
        let userExists = await User.fetchByUsername(req.body.username)
        if (userExists === undefined) {
            res.render('home', {
                title: 'Home',
                linkActive: 'home',
                //user: req.session.user,
                err: "Enter another username, this is already taken"
            })
            return
        } else {

        user = new User(req.body.username, req.body.firstname)
        req.session.user = user;
        let inserted = await User.enterNewUser(user)
        res.redirect('/menu')
        }
    })();
});

module.exports = router;
