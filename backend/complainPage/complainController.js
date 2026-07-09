const ComplaintPageSchema = require("../complainPage/complainPageSchema.js");


const complainController = async(req,res) => {

    
try{
    const {fullName, 
    email, 
    phone, 
    title, 
    type,
    priority, 
    incidentDate, 
    description,
    expectedResolution
  } = req.body;
           
    const  complainPageSchema= new ComplaintPageSchema({

       fullName, 
    email, 
    phone, 
    title, 
    type,
    priority, 
    incidentDate, 
    description,
    expectedResolution});

    
    await complainPageSchema.save();
    return res.status(201).json({
        message: "sumbit succesfully"
    });


    } catch(error){
  return res.status(500).json({
    message: "not sumbit"
  });

}

}

module.exports = complainController;













