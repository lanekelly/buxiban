export default class QuizItem {
    constructor(other, english, group) {
        this.other = other;
        this.english = english;
        this.group = group;
        this.isPresenting = false;
        this.unanswered = true;
    }
}