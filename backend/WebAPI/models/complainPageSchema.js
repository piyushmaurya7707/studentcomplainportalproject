const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fullName: {
        type: String,
        required: true,
        minlength: [2, "length is too short "]
    },
    email: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        maxLength: [500, "max 500 length string"]
    },
    type: String,
    priority: String,
    incidentDate: String,
    expectedResolution: String,

    viewed: {
        type: Boolean,
        default: false
    },
    accepted: {
        type: Boolean,
        default: false,
    },
    Status: {
        type: String,
        default: "pending"
    },
    reply: {
        type: String,
        default: "Thank you for your complaint"
    },

    image: String,
    video: String,
    document: String,

 }, { timestamps: true });

 const usercomplainSchema = mongoose.model("complainSchema", complainSchema);

 module.exports = usercomplainSchema;



 