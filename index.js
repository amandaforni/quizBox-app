const express = require("express");
var cors = require('cors')
const app = express();
const PORT = 5000;
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const AuthRoutes = require("./routes/AuthRoutes");

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECTION, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    () => console.log('Connected to mongo')
);

//middleware
app.use(cors())
app.use(express.json());

app.use("/", AuthRoutes);

app.listen(PORT, () => console.log(`Running server on port: ${PORT}`));