const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const pgSession = require('connect-pg-simple')(session);
const eventEmitter = require('events')
const socket = require('socket.io')


const PORT = process.env.PORT || 5000

var server = app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

// router setup
const homeRouter = require('./routes/home.routes');
const menuRouter = require('./routes/menu.routes');
const createRouter = require('./routes/create.routes');
const lobbyRouter = require('./routes/lobby.routes');
const questionRouter = require('./routes/question.routes');
const waitRouter = require('./routes/wait.routes');
const leaderboardRouter = require('./routes/leaderboard.routes');
const answersRouter = require('./routes/answers.routes');
const endgameRouter = require('./routes/endgame.routes');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(fileUpload());


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//session
app.use(session({
    store: new pgSession({
        pool: db.pool
    }),
    secret: 'F F',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 24 * 60 * 60 * 100}, 
}));

//socket
var io = socket(server)

io.on('connection',function(socket) {
    socket.on('roomUsers', function(data){
        io.sockets.emit('roomUsers', data)
    });

    var destination = '/question';
    socket.on('startGame', function() {
        io.emit('startGame', destination)
    })
});

// router setup
app.use('/', homeRouter);
app.use('/menu', menuRouter);
app.use('/create', createRouter);
app.use('/lobby', lobbyRouter);
app.use('/question', questionRouter);
app.use('/wait', waitRouter);
app.use('/leaderboard', leaderboardRouter);
app.use('/answers', answersRouter);
app.use('/endgame', endgameRouter);

exports.server = io;