import ComplaintPageSchema from "../complainPage/complainPageSchema.js";

const complain = async(req,res) => {

    
try{
    const {fullName,phoneNumber,complaintTitle, description,viewed,accepted, Status,reply,image , video,
    document,sumbittedAt} = req.body;
           
    const  complainPageSchema= new ComplaintPageSchema({

        fullName,phoneNumber,complaintTitle, description,viewed,accepted, Status,reply,imagevideo,
    document,sumbittedAt});

    
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

export default complain;













