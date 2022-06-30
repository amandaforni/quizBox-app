const router = require("express").Router();
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

router.post("/register", async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) return res.status(400).send("User already exists");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        password: hashPassword,
        auth: req.body.auth
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/login", async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(JSON.stringify(error.details[0].message));

    const user = await User.findOne({ username: req.body.username });

    if (!user) return res.status(400).send(JSON.stringify("Username or password is wrong"));

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send(JSON.stringify("Username or password is wrong"));

    const auth = user.auth;
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.send({ token: token, auth: auth });
});

//joi used to validate data
const registerSchema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    auth: Joi.string().required()
});

const loginSchema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
});

module.exports = router;