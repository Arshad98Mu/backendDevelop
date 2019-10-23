const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const appRoute = express.Router();
const User = require("./model/userModel");
const bcrypt = require("bcryptjs");

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

//new changes 21/10/2019

app.use("/app", appRoute);

appRoute.post("/api/signup", (req, res, next) => {
  let { body } = req;
  let { firstname, lastname, email, password } = body;

  if (!email) {
    return res.send({
      success: false,
      message: "Error: Email error."
    });
  }
  if (!password) {
    return res.send({
      success: false,
      message: "Error: Password error."
    });
  }

  email = email.toLowerCase();
  email = email.trim();

  User.find(
    {
      email: email
    },
    (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error"
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: "Error: Account already exist."
        });
      }

      const newUser = new User();
      newUser.email = email;
      //newUser.password = password;

      newUser.firstName = firstname;
      newUser.lastName = lastname;
      bcrypt.hash(password, 10, (err, hash) => {
        // Store hash password in DB
        newUser.password = hash;

        newUser.save((err, user) => {
          if (err) {
            return res.send({
              success: false,
              message: "Error: Server error"
            });
          }
          return res.send({
            success: true,
            message: "Signed up"
          });
        });
      });
    }
  );
});

appRoute.get("/api/login", (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  if (!userEmail) {
    return res.send({
      success: false,
      message: "Email cannot be blank."
    });
  }
  if (!userPassword) {
    return res.send({
      success: false,
      message: "Password cannot be blank."
    });
  }
  User.find({
    email: userEmail
  }).then((user) => {
    bcrypt.compare(userPassword, user.password, (err, result) => {
      console.log("inside bcrypt");
      if(result == true) {
        console.log("inside bcrypt-if");
        res.send({ status: "If Part" })
      }
      else if(user.length === 0) {
        res.send({
          status: "User not found"
        })
      }
      else {
        res.send({
          status: "Else Part"
        })
      }
    });
    //console.log("len is zero");
  }).catch(err => console.log(err));
});
app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});