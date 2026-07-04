const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    minlength: [2, "Name is too short"],
    maxlength: [40, "Name is too long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Minimum 6 characters required"],
  },
  mobileNumber: {
    type: String,
    required: [true, "Mobile number is required"],
    trim: true,
    match: [/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"],
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;