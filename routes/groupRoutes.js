const express = require("express");
const {
  createNewGroup,
  getGroupList,
} = require("../controllers/groupController");
const route = express();

route.post("/create-group/:id", createNewGroup);
route.get("/get-list/:id", getGroupList);

module.exports = route;
