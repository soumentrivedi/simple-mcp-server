const axios = require("axios");
const fs = require("fs");

exports.generateAIClip = async (req, res) => {
    const { userId, message, voice, stabilityApiKey, elevenLabsApiKey } = req.body;

    try {
        // Validate API Keys
        if (!stabilityApiKey || !elevenLabsApiKey) {
            throw new Error("Missing API Keys. Set STABILITY_API_KEY and ELEVENLABS_API_KEY in environment variables.");
        }
        // 1️⃣ Generate Image using Stability AI
        const imageResponse = await axios.post("https://api.stability.ai/v2beta/stable-image/generate/sd3", {
            prompt: message,
            steps: 30,
            width: 512,
            height: 512,
            samples: 1,
            output_format: "png",
        }, {
            headers: {
                "Authorization": `Bearer ${stabilityApiKey}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        if (!imageResponse.data || !imageResponse.data.artifacts) {
            throw new Error("Invalid response from Stability AI");
        }
        const imageUrl = imageResponse.data.artifacts[0].url;
        console.log("✅ AI Image Generated:", imageUrl);

        // 2️⃣ Generate Voiceover using Eleven Labs
        const voiceResponse = await axios.post("https://api.elevenlabs.io/v1/text-to-speech", {
            text: message,
            voice_id: voice || "Rachel"
        }, {
            headers: {
                "Authorization": `Bearer ${elevenLabsApiKey}`,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        if (!voiceResponse.data || !voiceResponse.data.audio_url) {
            throw new Error("Invalid response from Eleven Labs");
        }
        const voiceUrl = voiceResponse.data.audio_url;
        console.log("✅ AI Voiceover Generated:", voiceUrl);

        // 3️⃣ Merge Image & Voice into Video using FFmpeg (Mock)
        const videoUrl = `/public/generated/${userId}.mp4`;
        fs.writeFileSync(videoUrl, "fake-video-data");

        res.json({ video_url: videoUrl });
    } catch (error) {
        res.status(500).json({ error: "AI Processing failed", details: error.message });
    }
};
