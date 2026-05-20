const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settingsController");
const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/").get(protect, admin, getSettings).put(protect, admin, updateSettings);

module.exports = router;
