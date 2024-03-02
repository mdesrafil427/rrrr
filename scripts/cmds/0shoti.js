const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "shoti",
    author: "Rômeo",
    version: "2.0",
    cooldowns: 0,
    role: 0,
    shortDescription: "Get random shoti video",
    longDescription: "Get random shoti video",
    category: "𝗦𝗛𝗢𝗧𝗜 𝗩𝗜𝗗𝗘𝗢𝗦",
    guide: "{p}shoti",
  },

  onStart: async function ({ api, event, args, message }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);

    try {
      const response = await axios.get("https://shoti-kfm2.onrender.com/kshitiz");
      const postData = response.data.posts;
      const randomIndex = Math.floor(Math.random() * postData.length);
      const randomPost = postData[randomIndex];

      const videoUrls = randomPost.map(url => url.replace(/\\/g, "/"));

      const selectedUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];

      const videoResponse = await axios.get(selectedUrl, { responseType: "stream" });

      const tempVideoPath = path.join(__dirname, "cache", `${Date.now()}.mp4`);
      const writer = fs.createWriteStream(tempVideoPath);
      videoResponse.data.pipe(writer);

      writer.on("finish", async () => {
        const stream = fs.createReadStream(tempVideoPath);
        const user = response.data.user || "@user_unknown";
        await message.reply({
          body: `💖 𝗦𝗛𝗢𝗧𝗜 𝗩𝗜𝗗𝗘𝗢'𝗦\n\n🌼 𝐔𝐬𝐞𝐫𝐍𝐚𝐦𝐞\n➪ ${user}"`,
          attachment: stream,
        });
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        fs.unlink(tempVideoPath, (err) => {
          if (err) console.error(err);
          console.log(`Deleted ${tempVideoPath}`);
        });
      });
    } catch (error) {
      console.error(error);
      message.reply("⛔ 𝗘𝗥𝗥𝗢𝗥 𝗙𝗢𝗨𝗡𝗗\n\nSorry, an error occurred while processing your request.");
    }
  }
};