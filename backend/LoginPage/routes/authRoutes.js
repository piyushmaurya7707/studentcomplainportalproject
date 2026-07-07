const express = require("express");

const router = express.Router();

const {regerstration, login } = require("../controllers/authController.js");
const complain  = require("../../complainPage/complainController");

router.post("/signup",regerstration);
router.post("/login",login);
router.post("/complsinPage",complain);
module.exports = router;

 











