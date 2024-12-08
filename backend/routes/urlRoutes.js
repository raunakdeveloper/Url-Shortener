const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  getUserUrls,
  redirectToLongUrl,
  deleteUrl,
} = require("../controllers/urlController");
const { authenticate } = require("../middleware/auth");

router.post("/urls", authenticate, createShortUrl);
router.get("/urls", authenticate, getUserUrls);
router.delete("/urls/:id", authenticate, deleteUrl);
router.get("/:shortCode", redirectToLongUrl);

module.exports = router;
