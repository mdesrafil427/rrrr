const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "anigen",
    author: "Rômeo",
    version: "1.0",
    cooldowns: 0,
    role: 0,
    shortDescription: "Generate an image .",
    longDescription: "Generates an image ",
    category: "fun",
    guide: "{p}anigen <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
     api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    try {
      const prompt = args.join(" ");
      const emiApiUrl = "https://ai-tools.replit.app/emi";

      const emiResponse = await axios.get(emiApiUrl, {
        params: {
          prompt: prompt
        },
        responseType: "arraybuffer"
      });

      const cacheFolderPath = path.join(__dirname, "/cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(emiResponse.data, "binary"));

      const stream = fs.createReadStream(imagePath);
      message.reply({
        body: "💕 𝗔𝗡𝗜𝗠𝗘 𝗜𝗠𝗔𝗚𝗘\n\n➪ Here is Your Anime Image Based on Your Prompts",
        attachment: stream
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred. Please try again later.");
    }
  }
};