const axios = require("axios");
const fs = require("fs");

exports.generateAIClip = async (req, res) => {
    const { userId, message, voice, stabilityApiKey, elevenLabsApiKey } = req.body;

    try {
        // 1️⃣ Generate Image using Stability AI
        const imageResponse = await axios.post("https://api.stability.ai/v2beta/image/generate", {
            prompt: message,
            steps: 30,
            width: 512,
            height: 512,
            samples: 1
        }, {
            headers: {
                Authorization: `Bearer ${stabilityApiKey}`
            }
        });

        const imageUrl = imageResponse.data.image_url;

        // 2️⃣ Generate Voiceover using Eleven Labs
        const voiceResponse = await axios.post("https://api.elevenlabs.io/v1/text-to-speech", {
            text: message,
            voice_id: voice || "Rachel"
        }, {
            headers: {
                Authorization: `Bearer ${elevenLabsApiKey}`
            }
        });

        const voiceUrl = voiceResponse.data.audio_url;

        // 3️⃣ Merge Image & Voice into Video using FFmpeg (Mock)
        const videoUrl = `/public/generated/${userId}.mp4`;
        fs.writeFileSync(videoUrl, "fake-video-data");

        res.json({ video_url: videoUrl });
    } catch (error) {
        res.status(500).json({ error: "AI Processing failed", details: error.message });
    }
};
