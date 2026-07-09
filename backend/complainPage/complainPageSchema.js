const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        minlength: [2,"length is too short "]
    },
     email: {
        type: String,
        required: true
    
    },
    
    phone: {
        type: String,
        required: true,
        unique: true,
        minlength: [10,"min length should be 10"],
        maxlength: [10, "min length should be 10"],

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
    accepted: 
    {
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

     submittedAt: {
        
        type: Date,
        default: Date.now
     }


 });

 const usercomplainSchema = mongoose.model("usercomplainSchema",complainSchema);


 module.exports = usercomplainSchema;
 