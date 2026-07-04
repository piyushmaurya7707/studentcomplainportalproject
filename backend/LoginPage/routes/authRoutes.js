const express = require("express");

const router = express.Router();

const {regerstration, login } = require("../controllers/authController.js");

router.post("/signup",regerstration);
router.post("/login",login);

module.exports = router;

 











