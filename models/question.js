class Question {
    constructor(question, options, rightAnswer) {
        this.question = question;
        this.options = options;
        this.rightAnswer = rightAnswer;
        this.id = new Date().getTime().toString();
    }
}

module.exports = Question;