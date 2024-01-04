class RoomUser {
    constructor(id) {
        this.id = id;
        this.answers = [];
    }

    addAnswer(answer) {
        this.answers.push(answer);
    }

    getPoints() {
        let count = 0;

        for (const answer of this.answers) {
            if (answer.question.rightAnswer === answer.answer) {
                count++;
            }
        }

        return count;
    }
}


module.exports = RoomUser;