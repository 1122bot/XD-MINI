module.exports = {
  command: 'uptime',
  description: 'Check bot uptime',
  category: 'main',
  react: '⏱️',

  execute: async (socket, msg, args) => {
    const sender = msg.key.remoteJid;

    // 🕒 Calculate uptime
    const uptime = process.uptime(); // in seconds
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const uptimeMessage = `
╭───────────────⭓
│  ⏱️ *BOT UPTIME REPORT*
│  
│  🕐 Hours   : ${hours}h
│  ⏰ Minutes : ${minutes}m
│  ⏱️ Seconds : ${seconds}s
│  
│  ⚡ *popkid xmd*
╰───────────────⭓
`;

    await socket.sendMessage(sender, { text: uptimeMessage }, { quoted: msg });
  }
};