const express = require("express");
console.log("authRoutes loaded");

const router = express.Router();


const auth = require("../middleware/authMiddleware.js");
const { regerstration, login } = require("../middleware/authController.js");
const complainController = require("../controllers/complainController.js");
const getcomplainController = require("../controllers/getComplainController.js");
router.post("/signup", regerstration);
router.post("/login", login);
router.post("/complaint",auth, complainController);

router.get("/complaint",auth , getcomplainController);




module.exports = router;














