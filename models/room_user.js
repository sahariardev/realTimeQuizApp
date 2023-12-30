class RoomUser {
    constructor(id) {
        this.id = id;
        this.answers = [];
    }

    addAnswer(answer) {
        this.answers.push(answer);
    }

}


module.exports = RoomUser;