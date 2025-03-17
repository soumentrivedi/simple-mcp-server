const express = require("express");
const { generateAIClip } = require("./controllers");

const router = express.Router();

router.post("/generate", generateAIClip);

module.exports = router;
