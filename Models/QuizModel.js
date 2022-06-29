const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Quiz", quizSchema);