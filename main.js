const express = require('express');
const socketio = require('socket.io');
const {
    roomUpdateEventEmitter,
    NEW_ROOM_ADDED_EVENT,
    UPDATE_ROOMS_EVENT,
    SERVER_PORT
} = require('./helper/helper')
const bodyParser = require('body-parser');
const Room = require("./models/room");

const app = express();
const allRooms = [];
const expressServer = app.listen(SERVER_PORT, () => {
    console.log(`Starting server on port ${SERVER_PORT}`);
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//ROOMS
app.get('/', (req, res) => {
    res.render('home', {title: 'Quiz Rooms'});
})

//Admin
app.get('/admin', (req, res) => {
    res.render('admin', {title: 'Admin Page'});
})

app.post('/admin', (req, res) => {
    const roomName = req.body.roomName;
    const roomId = req.body.roomId

    const room = new Room(roomName, roomId);
    allRooms.push(room);
    roomUpdateEventEmitter.emit(NEW_ROOM_ADDED_EVENT, {rooms: allRooms, newRoom: room});

    res.render('admin', {title: 'Admin Page'});
})

const io = socketio(expressServer);

io.of('default').on('connection', (socket) => {
    console.log('Connected new socket connection');

    socket.emit(UPDATE_ROOMS_EVENT, {
        rooms: allRooms,
        newRoom: null
    });

    roomUpdateEventEmitter.on(NEW_ROOM_ADDED_EVENT, ({rooms, newRoom}) => {
        socket.emit(UPDATE_ROOMS_EVENT, {
            rooms: rooms,
            newRoom: newRoom
        });
    });
});
