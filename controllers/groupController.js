const Joi = require("joi");
const statusCodes = require("../common/statusCodes");
const GroupSchema = require("../models/groups");

const createNewGroup = async (req, res) => {
  console.log("createNewGroup");
  const id = req.params.id;
  const isValid = Joi.object({
    groupName: Joi.string().required(),
    description: Joi.string().optional(),
    members: Joi.array().required(),
    groupImage: Joi.string().optional(),
  }).validate(req.body);

  if (isValid.error) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Invalid input",
      data: isValid.error,
    });
  }

  const { groupName, description, members, groupImage } = req.body;

  const group = await GroupSchema.findOne({ groupName: groupName });
  if (group) {
    return res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Group with same name already exist.",
    });
  }

  const newGroup = new GroupSchema({
    groupName: groupName,
    description: description,
    members: [id, ...members],
    groupImage: groupImage,
    host: id,
    gid: id + Date.now(),
  });

  try {
    await newGroup.save();
    res.status(statusCodes.CREATED).send({
      status: statusCodes.CREATED,
      message: "Group created successfully.",
    });
  } catch (err) {
    res.status(statusCodes.BAD_REQUEST).send({
      status: statusCodes.BAD_REQUEST,
      message: "Db Error",
      data: err,
    });
  }
};
const getGroupList = async (req, res) => {
  try {
    const id = req.params.id;
    const userGroups = await GroupSchema.aggregate([
      {
        $match: {
          members: id,
        },
      },
    ]);

    res.status(statusCodes.OK).send({
      status: statusCodes.OK,
      message: "Groups fetched successfully.",
      data: userGroups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
      status: statusCodes.INTERNAL_SERVER_ERROR,
      message: "An error occurred while fetching groups.",
      error: error.message,
    });
  }
};

module.exports = { createNewGroup, getGroupList };
