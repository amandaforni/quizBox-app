const router = require("express").Router();
const Quiz = require("../models/QuizModel");
const dotenv = require("dotenv");

dotenv.config();

router.post("/saveQuiz", async (req, res) => {
    const quizExists = await Quiz.findOne({ title: req.body.title });

    if (quizExists) return res.status(400).send("Quiz name already exists");

    const quiz = new Quiz({
        title: req.body.title,
        questions: req.body.questions
    });

    try {
        const savedQuiz = await quiz.save();
        res.send(savedQuiz);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/updateQuiz", async (req, res) => {
    let newData = {
        title: req.body.title,
        questions: req.body.questions
    }

    Quiz.findOneAndUpdate({_id: req.body.quizId}, {"$set": newData}).exec( function(err, result) {
        if (err) {
            console.log(err)
            res.status(400).send(err);
        } else {
            res.json(result);
        }
    });
});

router.post('/deleteQuiz', async(req, res) => {
    Quiz.findOneAndDelete({ _id : req.body.quizId }, function (err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(result);
        }
    });
});

router.get('/getQuizzes', async(req, res) => {
    const quizzes = await Quiz.find();
    res.send(quizzes);
});

module.exports = router;