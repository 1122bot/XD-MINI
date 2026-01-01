const config = require('../config');

function runtime(seconds) {
  seconds = Number(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

module.exports = {
  command: "menu",
  description: "Show full stylish bot menu.",
  react: "👑",
  category: "main",

  execute: async (sock, msg) => {
    try {
      const from = msg.key.remoteJid;
      const sender = msg.key.participant || from;
      const pushname = msg.pushName || "there";

      const menuMsg = `
╔═══✦•💠•✦═══╗
      *👑 BILAL XMD MENU 👑*
╚═══✦•💠•✦═══╝

👤 *User:* ${pushname}
💬 *Prefix:* ${config.PREFIX}
⚙️ *Mode:* PUBLIC
🧩 *Version:* 2.0.0
⏱ *Uptime:* ${runtime(process.uptime())}

━━━━━━━━━━━━━━━━━━━━━━

🌐 *DOWNLOAD & MEDIA*
╭────────────────❖
│ ⬇️ Dl
│ 📦 Apk
│ 📘 Facebook
│ 🎵 Song
│ 🎬 Video
│ 🎥 TikTok
│ 🎥 Vv
│ 🐱 Cat
│ 🖼 Getpp
│ 🖼 Dp
│ 🌦 Weather
╰────────────────❖

🤖 *AI & GENERAL*
╭────────────────❖
│ 🧠 Aisummary
│ 😹 Joke
│ 🌐 Wabeta
│ 💫 Alive
│ ⏱ Uptime
│ ⚡ Ping
│ 🧭 Menu
╰────────────────❖

👥 *GROUP MANAGEMENT*
╭────────────────❖
│ 🆙 Promote
│ 👇 Demote
│ 🚫 Kickall
│ 🏷 Tagall
│ 🕶 Hidetag
│ 🔇 Mute
│ 🔊 Unmute
│ ❌ Delete
│ 🪩 Join
╰────────────────❖

🔐 *OWNER & CONTROL*
╭────────────────❖
│ 👑 Owner
│ ⛔ Block
│ 🔓 Unblock
│ 🔑 Pair
╰────────────────❖

✨ *Bilal 𝐦𝐢𝐧𝐢 𝐛𝐨𝐭* ✨
`;

      await sock.sendMessage(
        from,
        {
          image: { url: 'https://files.catbox.moe/kiy0hl.jpg' },
          caption: menuMsg,
          contextInfo: {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363289379419860@newsletter',
              newsletterName: '𝗽𝗼𝗽𝗸𝗶𝗱 𝘅𝗺𝗱',
              serverMessageId: 143
            }
          }
        },
        { quoted: msg }
      );

    } catch (e) {
      console.error("❌ Menu Error:", e);
      await sock.sendMessage(
        msg.key.remoteJid,
        { text: `❌ ERROR: ${e.message}` },
        { quoted: msg }
      );
    }
  }
};
