const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const newEntryRoutes = require("./routes/newEntryRoutes");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/user", userRoutes);
app.use("/user/group", groupRoutes);
app.use("/:id/new-entry", newEntryRoutes);

app.listen(process.env.DEFAULT_PORT, () => {
  console.log(`Server is running on port ${process.env.DEFAULT_PORT}`);
  Mongoose.connect(process.env.MONGODB_URI)
    .then((res) => {
      console.log("MongoDb Connected");
    })
    .catch((err) => {
      console.log(err);
    });
});
