const express = require("express");
const connectDB = require("./LoginPage/config/db.js");
const authRoute = require("./LoginPage/routes/authRoutes.js");
const cors = require("cors");

const app = express();
connectDB();


app.use(
    cors({
        origin: true,
        credentials: true

    })
);

app.use(express.json());

app.get("/",(req,res)=>{
        res.send("Server is running successfully");    
});

app.use("/api/auth",authRoute);


app.listen(3000,()=>{

  console.log("Server is running successfully");
    


});

















