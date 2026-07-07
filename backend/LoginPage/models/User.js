const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({

    fullNamae: {
        type: String,
        required: true,
        minlength: [2, "name is too small"],
        maxlength: [80, "name is too big"]
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    mobileNumber: {
        type: String,
        required: true,
        minlength: [10, "phone number is wrong"],
        maxlength: [10, "phone number is wrong"]

    },
    password: {
        type: String,
        required: true,
        minlength: [6, "password is too short"]

    }


});

const User = mongoose.model("User", UserSchema);


module.exports = User;








