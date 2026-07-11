const ComplaintSchema = require("../complainPage/complainPageSchema.js");


const complainController = async(req,res) => {

    
try{
    const {fullName, 
    email, 
    
    title, 
    type,
    priority, 
    incidentDate, 
    description,
    expectedResolution
  } = req.body;
           
    const  complainSchema= new ComplaintSchema({

    fullName, 
    email, 
     
    title, 
    type,
    priority, 
    incidentDate, 
    description,
    expectedResolution});

    
    await complainSchema.save();
    return res.status(201).json({
        message: "sumbit succesfully"
    });


    } catch(error){
      console.log(error);
  return res.status(500).json({
    message: error.message   
  }).send(error);

}

}

module.exports = complainController;













