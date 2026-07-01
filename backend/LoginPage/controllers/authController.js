const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

//Registration controller
const registration = async (req, res) => {
    const { fullName, email, password, mobileNumber, conformPassword } = req.body;
    try {
        const checkUser = await User.findOne({ email });

        if (checkUser) {
            return res.status(400).json({
                message: "user already exists"
            });
             
        }

         if (password !== conformPassword) {
                return res.status(400).json({
                    message: "password is missmatched with conformPassword"
                });
            }
            const hashPassword = await bcrypt.hash(password,10);

            const newUser = new User({
                fullName,
                email,
                password: hashPassword,
                mobileNumber,
                
            });

            
           
            await newUser.save();
       
    }
    catch (error) {
        return res.status(500).json({
            message: "internal server error "
        });
    }



}




// Login controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const checkUser = await User.findOne({
            email
        });
         if (!checkUser) {
            return res.status(400).json({
                message: "user not found"
            });

        }
         const isMatchPassword = await bcrypt.compare(password,checkUser.password);
         if (!isMatchPassword)
         {
            return res.status(400).json({
             message: "password is incorrect"
            });
         }
       
    }
    catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }


}
module.exports = {registration, login};
