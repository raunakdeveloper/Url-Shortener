const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

router.get("/profile", authenticate, getUserProfile);

module.exports = router;
