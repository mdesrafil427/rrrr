const axios = require('axios');

const Prefixes = [
  'Romeo',
  'romeo',
  '.romeo',
  '/romeo',
  '@romeo',
];

module.exports = {
  config: {
    name: "Ai",
    aliases: [`ai`],
    version: 1.0,
    author: "Rômeo",
    longDescription: "AI",
    category: "CHATGPT",
    guide: {
      en: "{p} questions",
    },
  },
  onStart: async function () {},
  onChat: async function ({ api, event, args, message }) {
    try {

      const prefix = Prefixes.find((p) => event.body && event.body.toLowerCase().startsWith(p));
      if (!prefix) {
        return; // Invalid prefix, ignore the command
      }
      const prompt = event.body.substring(prefix.length).trim();
   if (!prompt) {
        await message.reply("Hello! How can I assist you today.");
        return;
      }


      const response = await axios.get(`https://orochixyz.replit.app/orochi?prompt=${encodeURIComponent(prompt)}`);
      const answer = response.data.answer;


    await message.reply(`\n\n${answer}`);

    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};