const EventEmitter = require('events');
const roomUpdateEventEmitter = new EventEmitter();
const NEW_ROOM_ADDED_EVENT = 'NEW_ROOM_ADDED';
const UPDATE_ROOMS_EVENT = 'ROOMS_UPDATED';
const SERVER_PORT = 8000;

module.exports = {roomUpdateEventEmitter, NEW_ROOM_ADDED_EVENT, UPDATE_ROOMS_EVENT, SERVER_PORT}
