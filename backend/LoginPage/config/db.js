const mongoose = require("mongoose");

const connectDB = async () => {
    try{

        await mongoose.connect("");

        console.log("mongodb connected succesfully");
    }catch(error)
    {
        console.log(error);
        process.exit(1);
    }
};
module.exports = connectDB;