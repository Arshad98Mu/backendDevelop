const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    firstName: Schema.Types.String,
    LastName: Schema.Types.String,
    email: Schema.Types.String,
    password: Schema.Types.String
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
