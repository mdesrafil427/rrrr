const axios = require('axios');

module.exports = {
  config: {
    name: "sim",
    version: 2.0,
    author: "Rômeo",
    longDescription: "SIM chat",
    category: "simisimi",
    guide: {
      en: "{p}{n} questions",
    },
  },
  makeApiRequest: async function (lado) {
    try {
      const response = await axios.get(`https://sandipapi.onrender.com/sim?chat=${lado}&lang=en`);
      return response.data.answer;
    } catch (error) {
      throw error;
    }
  },
  handleCommand: async function ({ message, event, args, api }) {
    try {
      const lado = encodeURIComponent(args.join(" "));

      if (!lado) {
        return message.reply("⛔ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗧𝗘𝗫𝗧\n\n➤ I am here. Please provide input.");
      }

      const result = await this.makeApiRequest(lado);

      message.reply({
        body: `👑 𝗖𝗛𝗔𝗧𝗧𝗜𝗡𝗚 𝗩𝗘𝗥𝗦𝗜𝗢𝗡\n\n➤ ${result}`,
      }, (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          messageID: info.messageID,
          author: event.senderID
        });
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
  onStart: function (params) {
    return this.handleCommand(params);
  },
  onReply: function (params) {
    return this.handleCommand(params);
  },
};