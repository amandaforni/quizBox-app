const router = require("express").Router();
const Quiz = require("../models/QuizModel");
const dotenv = require("dotenv");

dotenv.config();

router.post("/saveQuiz", async (req, res) => {
    //Check if the quiz is already in the db
    const quizExists = await Quiz.findOne({ title: req.body.title });

    if (quizExists) return res.status(400).send("Quiz name already exists");

    //create new quiz
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

router.post('/deleteQuiz', async(req, res) => {
    const deleteQuiz = await Quiz.findOneAndDelete({ _id : req.body.quizId });
    
    if (deleteQuiz) return res.status(200);
});

router.get('/getQuizzes', async(req, res) => {
    const quizzes = await Quiz.find();
    res.send(quizzes);
});

module.exports = router;