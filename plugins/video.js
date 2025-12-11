const yts = require('yt-search');
const axios = require('axios');

module.exports = {
  command: 'video',
  alias: [
    "ytmp4","mp4","ytv","vi","v","vid","vide","videos","ytvi","ytvid",
    "ytvide","ytvideos","searchyt","download","get","need","search"
  ],
  description: "Download YouTube videos in MP4 format",
  category: "download",
  react: "🥺",
  usage: ".video <video name>",

  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const text = args.join(" ");

    // If no search term is provided
    if (!text) {
      return await socket.sendMessage(sender, {
        text: `
╭───────────────⭓
│ ❗ *Usage Example:*
│
│ 🎬 *.video <video name>*
│
│ Example:
│ 🔍 *.video Alan Walker Faded*
│
│ This command searches YouTube
│ and lets you download MP4 videos 🎞️
╰───────────────⭓
        `
      }, { quoted: msg });
    }

    try {
      const search = await yts(text);
      if (!search.videos.length)
        return await socket.sendMessage(sender, {
          text: `
╭───────────────⭓
│ 😔 *No video found!*
│ Please try again with another title.
╰───────────────⭓
          `
        }, { quoted: msg });

      const data = search.videos[0];
      const ytUrl = data.url;

      // API request
      const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
      const { data: apiRes } = await axios.get(api);

      if (!apiRes?.status || !apiRes.result?.media?.video_url) {
        return await socket.sendMessage(sender, {
          text: `
╭───────────────⭓
│ 😔 *Failed to process video download!*
│ Please try again later.
╰───────────────⭓
          `
        }, { quoted: msg });
      }

      const result = apiRes.result.media;

      // Beautiful caption box
      const caption = `
╭───────────────⭓
│ 🎬 *${data.title}*
│ 👁️ *Views:* ${data.views}
│ ⏱️ *Duration:* ${data.timestamp}
│ 📅 *Uploaded:* ${data.ago}
│ 🔗 *Link:* ${data.url}
│
│ 🔢 *Reply with the number to download:*
│
│ ╭─────────────●●►
│ ├ 🎞️ *1* — Normal Video
│ ├ 📁 *2* — As File (Document)
│ ╰─────────────●●►
╰───────────────⭓
      `;

      // Send menu box with thumbnail
      const sentMsg = await socket.sendMessage(
        sender,
        { image: { url: result.thumbnail }, caption },
        { quoted: msg }
      );

      const messageID = sentMsg.key.id;

      // Wait for reply "1" or "2"
      socket.ev.on("messages.upsert", async (msgData) => {
        const receivedMsg = msgData.messages[0];
        if (!receivedMsg?.message) return;

        const receivedText =
          receivedMsg.message.conversation ||
          receivedMsg.message.extendedTextMessage?.text;

        const isReplyToBot =
          receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

        const senderID = receivedMsg.key.remoteJid;

        if (isReplyToBot) {
          switch (receivedText.trim()) {
            case "1":
              await socket.sendMessage(senderID, {
                video: { url: result.video_url },
                mimetype: "video/mp4",
                caption: `
╭───────────────⭓
│ ✅ *Here’s your video!*
│ Enjoy watching 🎬
│
│ 👑 *Downloaded by POPKID-XMD*
╰───────────────⭓
                `
              }, { quoted: receivedMsg });
              break;

            case "2":
              await socket.sendMessage(senderID, {
                document: { url: result.video_url },
                mimetype: "video/mp4",
                fileName: `${data.title}.mp4`,
                caption: `
╭───────────────⭓
│ ✅ *Video saved as document!*
│ Perfect for sharing 💾
│
│ 👑 *Downloaded by POPKID-XMD*
╰───────────────⭓
                `
              }, { quoted: receivedMsg });
              break;

            default:
              await socket.sendMessage(senderID, {
                text: `
╭───────────────⭓
│ ⚠️ *Please reply only 1 or 2!*
│ Choose the correct option 🥺
╰───────────────⭓
                `
              }, { quoted: receivedMsg });
          }
        }
      });

    } catch (error) {
      console.error("Video download error:", error);
      await socket.sendMessage(sender, {
        text: `
╭───────────────⭓
│ 😔 *Something went wrong!*
│ Please try again later.
╰───────────────⭓
        `
      }, { quoted: msg });
    }
  }
};