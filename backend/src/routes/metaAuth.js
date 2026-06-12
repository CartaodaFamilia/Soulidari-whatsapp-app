const express = require("express");
const { startMetaOnboarding, handleMetaCallback } = require("../controllers/metaAuthController");
const router = express.Router();
router.get("/start", startMetaOnboarding);
router.get("/callback", handleMetaCallback);
module.exports = router;