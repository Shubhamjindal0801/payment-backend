const express = require("express");
const router = express();
const { makeNewEntry } = require("../controllers/entryController");

router.post("/", makeNewEntry);

module.exports = router;