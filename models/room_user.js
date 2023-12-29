class RoomUser {
    constructor(id) {
        this.id = id;
        this.answers = [];
    }

    addAnswer(answer) {
        this.answers = answer;
    }

}


module.exports = RoomUser;