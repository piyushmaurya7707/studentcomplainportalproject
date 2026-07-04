const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/");
       console.log("mongoDB connect succesfuly");
    } catch (error) {
        console.log("connection error ");
    }
};

module.exports = connectDB;

