const fetch = require('node-fetch');

module.exports = {
  command: 'song',
  alias: ["play", "mp3", "audio", "music", "s", "so", "son", "songs"],
  description: "Download YouTube song (Audio)",
  category: "download",
  react: "🎵",
  usage: ".song <song name>",

  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;
    const text = args.join(" ");

    // 🧾 No input provided
    if (!text) {
      return await socket.sendMessage(sender, {
        text: `*🎧 HOW TO USE SONG COMMAND 🎧*\n
Use the command like this:
> .song <song name>

Example:
> .song Shape of You`,
      }, { quoted: msg });
    }

    try {
      // 🎯 Fetch from Nekolabs API
      const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(text)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();

      if (!data?.success || !data?.result?.downloadUrl) {
        return await socket.sendMessage(sender, { text: "*😔 Song not found. Try another name!*" }, { quoted: msg });
      }

      const meta = data.result.metadata;
      const dlUrl = data.result.downloadUrl;

      // 🖼️ Try fetching the thumbnail
      let buffer = null;
      try {
        const thumbRes = await fetch(meta.cover);
        buffer = Buffer.from(await thumbRes.arrayBuffer());
      } catch (e) {
        buffer = null;
      }

      // 📦 Song info box
      const caption = `
╔══✦ *🎵 SONG INFORMATION 🎵* ✦══╗
┃ *🎧 Title:* ${meta.title}
┃ *📺 Channel:* ${meta.channel}
┃ *⏱️ Duration:* ${meta.duration}
╚══════════════════════════╝
*POPKID XMD BOT*`;

      // 🖼️ Send thumbnail or info text
      if (buffer) {
        await socket.sendMessage(sender, { image: buffer, caption }, { quoted: msg });
      } else {
        await socket.sendMessage(sender, { text: caption }, { quoted: msg });
      }

      // 🎶 Send audio file
      await socket.sendMessage(sender, {
        audio: { url: dlUrl },
        mimetype: "audio/mpeg",
        fileName: `${meta.title.replace(/[\\/:*?"<>|]/g, "").slice(0, 80)}.mp3`
      }, { quoted: msg });

      // ✅ React success
      await socket.sendMessage(sender, { react: { text: "✅", key: msg.key } });

    } catch (err) {
      console.error("Audio download error:", err);
      await socket.sendMessage(sender, { text: "*😔 Something went wrong. Try again!*" }, { quoted: msg });
    }
  }
};