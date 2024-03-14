const User = require("../models/User");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { emailCheck } = require("../utils/emailCheck");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const statusCodes = require("../common/statusCodes");
const secretKey = crypto.randomBytes(32).toString("hex");
const schedule = require("node-schedule");

const registerUser = async (req, res) => {
  const isValid = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
  }).validate(req.body);
  if (isValid.error) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Invalid input",
      data: isValid.error,
    });
  }
  const { firstName, lastName, email, password } = req.body;
  const isEmailExist = await emailCheck(email);
  if (isEmailExist === "E") {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Email already exist.",
    });
  }
  const hashPass = await bcrypt.hash(password, 10);
  const userObj = new User({
    uid: uuidv4(),
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashPass,
  });
  try {
    await userObj.save();
    res.status(200).send({
      status: 200,
      message: "User registered successfully.",
    });
  } catch (err) {
    res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Db Error",
      data: err,
    });
  }
};
const signInUser = async (req, res) => {
  const isValid = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
  }).validate(req.body);
  if (isValid.error) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Invalid input",
      data: isValid.error,
    });
  }
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "User not found.",
    });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Invalid password.",
    });
  }
  const payload = {
    email: email,
  };
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
  await User.findOneAndUpdate({ email: email }, { lastSessionId: token });

  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
  schedule.scheduleJob(oneHourFromNow, async () => {
    await User.findOneAndUpdate(
      { email: email },
      { $unset: { lastSessionId: "" } }
    );
  });
  res.status(statusCodes.OK).send({
    status: statusCodes.OK,
    message: "User logged in successfully.",
    data: {
      token: token,
      creatorId: user.uid,
    },
  });
};
const checkUserLoggedIn = async (req, res) => {
  const creatorId = req.params.id;
  const user = await User.findOne({ uid: creatorId });
  if (!user) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "User not found.",
    });
  }
  if (!user.lastSessionId) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "User not logged in.",
    });
  }
  res.status(statusCodes.OK).send({
    status: statusCodes.OK,
    message: "User logged in.",
  });
};
const userDetails = async (req, res) => {
  const creatorId = req.params.id;
  const user = await User.findOne({ uid: creatorId });
  if (!user) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "User not found.",
    });
  }
  const userData = {
    firstName: user.firstName,
    name: user.firstName + " " + user.lastName,
    email: user.email,
    uid: user.uid,
  };
  res.status(statusCodes.OK).send({
    status: statusCodes.OK,
    message: "User details.",
    data: userData,
  });
};

module.exports = { registerUser, signInUser, checkUserLoggedIn, userDetails };
