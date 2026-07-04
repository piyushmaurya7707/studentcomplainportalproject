
const User = require("../models/User");
const bcrypt = require("bcryptjs");



const regerstration = async (req,res)=>{
    try{
        const { fullName , email ,mobileNumber, password , conformPassword } = req.body;
        const checkUser= await  User.findOne({ email });

        if(checkUser)
        {
            return res.status(201).json({
    message: "user already exist"
            });
        }
        if( password !== conformPassword ){
                
            return res.status(201).json({
    message: "password is not matched with conform password"
            });
            }
            const hash = await bcrypt.hash(password,10);
            const user = new User({
                fullName,
                email,
                mobileNumber,
                password: hash,
            });
            await user.save();
         return res.status(201).json({
    message: "User has successfully registered"
            });
    }catch(error){
       return res.status(201).json({
    message: "User has successfully registered"
        
        });


    }
}
        const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Login successful"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

        module.exports = { regerstration , login };









