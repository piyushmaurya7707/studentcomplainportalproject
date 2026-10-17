require("dotenv").config();


const express = require("express");

const authRouter = require("./LoginPage/routes/authRoutes.js");
const connectDB = require("./LoginPage/config/db.js");
const cors = require("cors");

const app = express();
connectDB();


app.use(

  cors({
    origin: true,
    credintals: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is connected");

});
app.use("/api/auth/", authRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server connect on port ${PORT}`);
})




