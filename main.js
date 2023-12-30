const express = require('express');
const socketio = require('socket.io');
const {
    roomUpdateEventEmitter,
    NEW_ROOM_ADDED_EVENT,
    UPDATE_ROOMS_EVENT,
    SERVER_PORT,
    JOIN_ROOM_EVENT,
    ADD_QUESTION_EVENT,
    UPDATE_QUESTIONS_EVENT,
    ADMIN_JOIN_ROOM_EVENT,
    SHOW_QUESTION_EVENT,
    REQUEST_TO_SHOW_QUESTION_EVENT,
    USER_ANSWER_EVENT,
    isValidRoom,
    getRoom
} = require('./helper/helper')
const bodyParser = require('body-parser');
const Room = require("./models/room");
const RoomUser = require("./models/room_user");
const Question = require("./models/question");
const scoketUserIdMapping = {};

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
});

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

    socket.on(ADD_QUESTION_EVENT, (data, roomId) => {
        const room = getRoom(roomId, allRooms);

        const question = new Question(data.question, data.options, data.answer);
        room.addQuestion(question);

        io.of('default').to(roomId).emit(UPDATE_QUESTIONS_EVENT, room.questions);
    });

    socket.on(ADMIN_JOIN_ROOM_EVENT, (roomId) => {
        socket.join(roomId);
        const room = getRoom(roomId, allRooms);
        io.of('default').to(roomId).emit(UPDATE_QUESTIONS_EVENT, room.questions);
    });

    socket.on(REQUEST_TO_SHOW_QUESTION_EVENT, ({questionId, roomId}) => {
        const room = getRoom(roomId, allRooms);
        const question = room.getQuestion(questionId);

        io.of('default').to(roomId).emit(SHOW_QUESTION_EVENT, question);
    });

    socket.on(USER_ANSWER_EVENT, (data) => {
        const roomId = Object.keys(socket.rooms)[1]
        const userId = scoketUserIdMapping[socket.id];
        const room = getRoom(roomId, allRooms);
        room.addUserAnswer(data.questionId, data.answer, userId);
    });

    socket.on(JOIN_ROOM_EVENT, ({roomId, userId}, callBack) => {
        if (isValidRoom(roomId, allRooms)) {

            const room = getRoom(roomId, allRooms);

            if (room.isUserAlreadyExistInThisRoom(userId)) {
                delete scoketUserIdMapping[socket.id];

            } else {
                room.addRoomUser(new RoomUser(userId));
            }

            scoketUserIdMapping[socket.id] = userId;

            socket.join(roomId);

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
