const express = require('express');
const socketio = require('socket.io');
const {
    roomUpdateEventEmitter,
    NEW_ROOM_ADDED_EVENT,
    UPDATE_ROOMS_EVENT,
    SERVER_PORT,
    JOIN_ROOM_EVENT,
    isValidRoom,
    getRoom
} = require('./helper/helper')
const bodyParser = require('body-parser');
const Room = require("./models/room");
const RoomUser = require("./models/room_user");

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

app.get('/admin/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const validRoom = isValidRoom(roomId, allRooms);
    const data = {title: 'Admin Quiz Page', isValidRoom: validRoom};

    if (validRoom) {
      data['room'] = getRoom(roomId, allRooms);
    }

    res.render('quizEdit', data);
});

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

    socket.on(JOIN_ROOM_EVENT, ({roomId, userId}, callBack) => {
        if (isValidRoom(roomId, allRooms)) {

            const room = getRoom(roomId, allRooms);

            if (room.isUserAlreadyExistInThisRoom(userId)) {
                callBack({
                    status: 'FAILED',
                    message: `Failed to join the room ${roomId}. Someone with same name already joined.`
                });

                return;
            }

            socket.join(roomId);
            room.addRoomUser(new RoomUser(userId));

            callBack({
                status: 'OK',
                message: 'Successfully Joined the room'
            });

        } else {
            callBack({
                status: 'FAILED',
                message: `Failed to join the room ${roomId}`
            });
        }
    });
});
