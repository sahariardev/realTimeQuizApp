class Room {
    constructor(roomName, roomId) {
        this.roomName = roomName;
        this.roomId = roomId;
        this.roomUsers = [];
        this.questions = [];
    }

    addRoomUser(roomUser) {
        this.roomUsers.push(roomUser);
    }

    getRoomUsers() {
        return this.roomUsers;
    }

    getRoomUser(id) {
        return this.getRoomUsers().filter(user => user.id === id)[0];
    }

    isValidUser(id) {
        return this.getRoomUsers().filter(user => user.id === id).length > 0;
    }

    addQuestion(question) {
        this.questions.push(question);
    }

    getQuestion(id) {
        return this.questions.filter(question => question.id === id)[0];
    }

    isUserAlreadyExistInThisRoom(userId) {
        return this.getRoomUsers().filter(user => user.id === userId).length > 0;
    }
}

module.exports = Room;