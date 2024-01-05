const UserAnswer = require("./user_answer");

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

    addUserAnswer(questionId, answer, userId) {
        const question = this.getQuestion(questionId);
        const userAnswer = new UserAnswer(question, answer);
        const user = this.getRoomUser(userId);
        user.addAnswer(userAnswer);
    }

    getResult() {
        const userPoints = [];

        for (const user of this.roomUsers) {
            userPoints.push({
                name: user.name,
                userId: user.id,
                points: user.getPoints()
            });
        }

        userPoints.sort((up1, up2)=> up2.points - up1.points);

        return userPoints;
    }
}

module.exports = Room;