const axios = require('axios');

module.exports = {
  command: 'tiktok',
  alias: ["ttdl", "tt", "tiktokdl"],
  description: "Download TikTok video without watermark",
  category: "download",
  react: "🎵",
  usage: ".tiktok <TikTok URL>",

  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const text = args.join(" ");
    let waitMsg;

    try {
      // React to command message
      await socket.sendMessage(sender, { react: { text: "🥺", key: msg.key } });

      // If no TikTok link is provided
      if (!text) return await socket.sendMessage(sender, {
        text: `
╭───────────────⭓
│ ❗ *Usage Example:*
│
│ 🎵 *tiktok <TikTok URL>*
│
│ Example:
│ 🔗 *tiktok https://vm.tiktok.com/xxxx/*
│
│ This command downloads TikTok videos
│ without watermark and sends them here 💖
╰───────────────⭓
        `
      }, { quoted: msg });

      // If not a TikTok link
      if (!text.includes("tiktok.com")) {
        await socket.sendMessage(sender, { react: { text: "☹️", key: msg.key } });
        return await socket.sendMessage(sender, {
          text: `
╭───────────────⭓
│ ❌ *Invalid TikTok link!*  
│ Please send a valid link 😔
╰───────────────⭓
          `
        }, { quoted: msg });
      }

      // Waiting message
      waitMsg = await socket.sendMessage(sender, { 
        text: `
╭───────────────⭓
│ ⏳ *Downloading your TikTok video...*
│ Please wait patiently 🥰
╰───────────────⭓
        `
      });

      // Fetch TikTok video using API
      const apiUrl = `https://lance-frank-asta.onrender.com/api/tikdl?url=${text}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data) {
        if (waitMsg) await socket.sendMessage(sender, { delete: waitMsg.key });
        await socket.sendMessage(sender, { react: { text: "😔", key: msg.key } });
        return await socket.sendMessage(sender, {
          text: `
╭───────────────⭓
│ 😔 *Failed to download video!*
│ Please try again later.
╰───────────────⭓
          `
        }, { quoted: msg });
      }

      // Extract video
      const { meta } = data.data;
      const videoUrl = meta.media.find(v => v.type === "video").org;

      // Caption box styled
      const caption = `
╭───────────────⭓
│ 🎬 *${meta.title || "TikTok Video"}*
│ 👤 *Author:* ${meta.author?.nickname || "Unknown"}
│ 👁️ *Views:* ${meta.playCount || "N/A"}
│ ❤️ *Likes:* ${meta.diggCount || "N/A"}
│ 💬 *Comments:* ${meta.commentCount || "N/A"}
│ 🔗 *URL:* ${text}
│
│ ✅ *Downloaded by POPKID-XMD 👑*
╰───────────────⭓
      `;

      // Send video
      await socket.sendMessage(sender, {
        video: { url: videoUrl },
        caption,
        contextInfo: { mentionedJid: [msg.sender] }
      }, { quoted: msg });

      // Delete waiting message
      if (waitMsg) await socket.sendMessage(sender, { delete: waitMsg.key });

      // React after success
      await socket.sendMessage(sender, { react: { text: "☺️", key: msg.key } });

    } catch (e) {
      console.error("TikTok command error:", e);
      if (waitMsg) await socket.sendMessage(sender, { delete: waitMsg.key });
      await socket.sendMessage(sender, { react: { text: "😔", key: msg.key } });
      await socket.sendMessage(sender, {
        text: `
╭───────────────⭓
│ 😔 *An error occurred!*
│ Please try again later.
╰───────────────⭓
        `
      }, { quoted: msg });
    }
  }
};