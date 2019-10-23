const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const appRoute = express.Router();
const User = require("./model/userModel");
const bcrypt = require("bcryptjs");
const authenticate = require("./auth_apis/authenticate");

const PORT = 4000;

mongoose.connect("mongodb://127.0.0.1:27017/A_finalYearProject_M", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once(`open`, () => {
  console.log("database connection established successfully");
});

app.use(cors());
app.use(bodyParser.json());

//Auth apis
app.use("/app", authenticate);

app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});
