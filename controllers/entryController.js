const statusCodes = require("../common/statusCodes");
const newEntry = require("../models/newEntry");
const User = require("../models/User");
const Joi = require("joi");

const makeNewEntry = async (req, res) => {
  const createdBYIsValid = Joi.string().required().validate(req.params.id);
  if (createdBYIsValid.error) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Invalid creator id",
      data: createdBYIsValid.error,
    });
  }

  const isValid = Joi.object({
    totalAmout: Joi.number().required(),
    date: Joi.number().required(),
    members: Joi.array().required(),
    description: Joi.string().optional(),
  }).validate(req.body);
  if (isValid.error) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Invalid input",
      data: isValid.error,
    });
  }

  const createdBy = req.params.id;
  const { totalAmout, date, members } = req.body;
  const description = req.body.description || null;
  const UserData = await User.findById(createdBy);
  if (!UserData) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "User not found",
    });
  }
  const newEntryObj = new newEntry({
    totalAmout: totalAmout,
    createdBy: createdBy,
    date: date,
    [description ? "description" : ""]: description,
    members: [...members, createdBy],
  });
  try {
    await User.updateOne({ _id: createdBy }, { $inc: { totalPayments: 1 } });
    await newEntryObj.save();
    res.status(statusCodes.OK).send({
      status: statusCodes.OK,
      message: "New entry added.",
    });
  } catch (err) {
    res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Error creating payment",
      data: err,
    });
  }
};

module.exports = {
  makeNewEntry,
};
