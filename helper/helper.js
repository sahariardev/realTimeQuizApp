const EventEmitter = require('events');
const roomUpdateEventEmitter = new EventEmitter();
const NEW_ROOM_ADDED_EVENT = 'NEW_ROOM_ADDED';
const UPDATE_ROOMS_EVENT = 'ROOMS_UPDATED';
const JOIN_ROOM_EVENT = 'JOIN_ROOM';
const SERVER_PORT = 8000;

const isValidRoom = (roomId) => {
    for (room of allRooms) {
        if (room.roomId == roomId) {
            return true;
        }
    }

    return false;
}

module.exports = {roomUpdateEventEmitter, NEW_ROOM_ADDED_EVENT, UPDATE_ROOMS_EVENT, SERVER_PORT, JOIN_ROOM_EVENT, isValidRoom}
