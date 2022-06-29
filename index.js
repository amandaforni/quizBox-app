const express = require("express");
var cors = require('cors')
const app = express();
const PORT = 5000;
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const AuthRoutes = require("./routes/authRoutes");
const QuizRoutes = require("./routes/quizRoutes");

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECTION, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).then(() => {
    console.log('connected to mongo');
}).catch(err => {
    console.log('error connecting to mongo:', err);
});

//middleware
app.use(cors())
app.use(express.json());

app.use("/", AuthRoutes);
app.use("/quiz/", QuizRoutes);

app.listen(PORT, () => console.log(`Running server on port: ${PORT}`));