const express = require("express");
console.log("authRoutes loaded");

const router = express.Router();
const { registration, login } = require("../controllers/authController.js");
const complainController = require("../../complainPage/complainController");
const getcomplainController = require("../../complainPage/getComplainController");
router.post("/signup", registration);
router.post("/login", login);
router.post("/complainPage", complainController);

router.get("/complainPage", getcomplainController);




module.exports = router;














