const express = require("express");
const router = express();
const {
  registerUser,
  signInUser,
  checkUserLoggedIn,
  userDetails,
} = require("../controllers/userController");

router.post("/signup", registerUser);
router.post("/login", signInUser);
router.get("/logged/:id", checkUserLoggedIn);
router.get("/get-details/:id", userDetails);

module.exports = router;
