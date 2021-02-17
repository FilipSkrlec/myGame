var express = require('express');
var router = express.Router();
const Room = require('../models/RoomModel');

router.get('/', function(req,res,next) {
    (async () => {

        res.render('wait', {
            title : 'wait',
            user: req.session.user
        })
    })();
});


module.exports = router;