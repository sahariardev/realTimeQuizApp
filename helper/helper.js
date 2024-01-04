const EventEmitter = require('events');
const roomUpdateEventEmitter = new EventEmitter();
const adminJoinRoomEventEmitter = new EventEmitter();
const NEW_ROOM_ADDED_EVENT = 'NEW_ROOM_ADDED';
const UPDATE_ROOMS_EVENT = 'ROOMS_UPDATED';
const JOIN_ROOM_EVENT = 'JOIN_ROOM';
const ADMIN_JOIN_ROOM_EVENT = 'ADMIN_JOIN_ROOM';
const ADD_QUESTION_EVENT = 'ADD_QUESTION';
const UPDATE_QUESTIONS_EVENT = 'QUESTION_UPDATED';
const SHOW_QUESTION_EVENT = 'SHOW_QUESTION';
const REQUEST_TO_SHOW_QUESTION_EVENT = 'REQUEST_TO_SHOW_QUESTION';
const REQUEST_TO_SHOW_RESULT_EVENT = 'REQUEST_TO_SHOW_RESULT';
const SHOW_RESULT_EVENT = 'SHOW_RESULT';
const USER_ANSWER_EVENT = 'USER_ANSWER';
const SERVER_PORT = 8000;

const isValidRoom = (roomId, allRooms) => {
    console.log(roomId);
    for (room of allRooms) {
        if (room.roomId == roomId) {
            return true;
        }
    }

    return false;
}

const getRoom = (roomId, allRooms) => {
    for (room of allRooms) {
        if (room.roomId == roomId) {
            return room;
        }
    }

    return null;
}

module.exports = {
    roomUpdateEventEmitter,
    adminJoinRoomEventEmitter,
    NEW_ROOM_ADDED_EVENT,
    UPDATE_ROOMS_EVENT,
    SERVER_PORT,
    JOIN_ROOM_EVENT,
    ADD_QUESTION_EVENT,
    UPDATE_QUESTIONS_EVENT,
    ADMIN_JOIN_ROOM_EVENT,
    SHOW_QUESTION_EVENT,
    REQUEST_TO_SHOW_QUESTION_EVENT,
    REQUEST_TO_SHOW_RESULT_EVENT,
    SHOW_RESULT_EVENT,
    USER_ANSWER_EVENT,
    isValidRoom,
    getRoom
}
