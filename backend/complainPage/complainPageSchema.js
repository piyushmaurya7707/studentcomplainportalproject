const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
    fullName: {
        type: String,
        requiement: true,
        minlength: [2,"length is too short "]
    },
    
    phoneNumber: {
        type: String,
        requiement: true,
        unique: true,
        minlength: [10,"min length should be 10"],
        maxlength: [10, "min length should be 10"],

    },
    complaintTitle: {
        type: String,
        requiement: true,

    },
    
    description: {
        type: String,
        maxLength: [500, "max 500 length string"]

    },
    complainType: String,
    priorityLevel: String,
    DateOfIncident: String,
    ExpectedResolution: String,

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
 