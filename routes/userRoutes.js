const express = require("express");
const router = express();
const {
  registerUser,
  signInUser,
  checkUserLoggedIn,
  getUserDetails,
  addFriend,
  getFriendList,
  removeFriend,
} = require("../controllers/userController");

router.post("/signup", registerUser);
router.post("/login", signInUser);
router.get("/logged/:id", checkUserLoggedIn);
router.get("/get-user-detail/:identifier", getUserDetails);
router.post("/add-friend/:id", addFriend);
router.post("/remove-friend/:id", removeFriend);
router.get("/get-friend-list/:id", getFriendList);

module.exports = router;
