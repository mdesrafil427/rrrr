const { loadImage, createCanvas } = require("canvas");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "pornhub",
    author: "Rômeo",
    version: "1.0",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "",
    },
    longDescription: {
      en: "",
    },
    category: "fun",
    guide: {
      en: "",
    }
  },
  wrapText: async (ctx, text, maxWidth) => {
    if (ctx.measureText(text).width < maxWidth) return [text];
    if (ctx.measureText('W').width > maxWidth) return null;
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, temp.slice(-1));
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return lines;
  },
  onStart: async function ({ api, event, args }) {
    let { senderID, threadID, messageID } = event;
    let avatar = __dirname + '/cache/avt.png';
    let pathImg = __dirname + '/cache/porn.png';
    var text = args.join(" ");
    let name = (await api.getUserInfo(senderID))[senderID].name;
    var linkAvatar = (await api.getUserInfo(senderID))[senderID].thumbSrc;
    if (!text) return api.sendMessage("⛔ 𝗜𝗡𝗩𝗔𝗜𝗗 𝗧𝗘𝗫𝗧\n\n📝 Post the content of the comment on ponhub", threadID, messageID);
    let getAvatar = (await axios.get(linkAvatar, { responseType: 'arraybuffer' })).data;
    let getPorn = (await axios.get(`https://raw.githubusercontent.com/ProCoderMew/Module-Miraiv2/main/data/phub.png`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatar, Buffer.from(getAvatar, 'utf-8'));
    fs.writeFileSync(pathImg, Buffer.from(getPorn, 'utf-8'));
    let image = await loadImage(avatar);
    let baseImage = await loadImage(pathImg);
    let canvas = createCanvas(baseImage.width, baseImage.height);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 30, 310, 70, 70);
    ctx.font = "700 23px Arial";
    ctx.fillStyle = "#FF9900";
    ctx.textAlign = "start";
    ctx.fillText(name, 115, 350);
    ctx.font = "400 23px Arial";
    ctx.fillStyle = "#ffff";
    ctx.textAlign = "start";
    let fontSize = 23;
    while (ctx.measureText(text).width > 2600) {
      fontSize--;
      ctx.font = `400 ${fontSize}px Arial, sans-serif`;
    }
    const lines = await this.wrapText(ctx, text, 1160);
    ctx.fillText(lines.join('\n'), 30,430);
    ctx.beginPath();
    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);
    fs.removeSync(avatar);
    return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
  }
};