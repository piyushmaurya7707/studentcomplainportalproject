const complainPage = require("../complainPage/complainPageSchema");

   const getComplains = async(req,res)=>{
    try{
    const complains = await complainPage.find();

    res.json(complains);
       
    }catch(error)
    {
        return res.status(500).json({
            messsage: error.message
        });
    }


   }
   
   module.exports = getComplains;



 

