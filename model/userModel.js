const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const config = require("../config");

let UserSchema = new Schema(
  {
    firstName: Schema.Types.String,
    LastName: Schema.Types.String,
    email: Schema.Types.String,
    password: Schema.Types.String,
    token: [{ type: Schema.Types.String }]
  },
  { timestamps: true }
);

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const token = jwt.sign({ _id: user._id }, config.secret).toString();
  user.token.push(token);
  return user.save().then(() => {
    return token;
  });
};

module.exports = mongoose.model("users", UserSchema);
