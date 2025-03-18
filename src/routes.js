const express = require("express");
const { generateAIClip } = require("./controllers");

const router = express.Router();
router.post("/generate-ai-clip", generateAIClip);

module.exports = router;
