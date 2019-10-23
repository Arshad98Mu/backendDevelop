const User = require("../model/userModel");
const express = require("express");
const app = express();
const appRoute = express.Router();
const bcrypt = require("bcryptjs");

//signup

module.exports = signup = appRoute.post("/api/signup", (req, res, next) => {
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

//login

module.exports = login = appRoute.get("/api/login", (req, res, next) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  User.findOne({
    email: userEmail
  })
    .then(user => {
      if (!user) {
        res.send({ status: "user not found" });
      } else
        bcrypt.compare(userPassword, user.password, (err, result) => {
          if (result) {
            res.send({ user, status: "success" });
          } else {
            res.send({ status: "incorrect password" });
          }
        });
    })
    .catch(err => console.log(err));
});
