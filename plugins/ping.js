module.exports = {
  command: "ping",
  desc: "Check bot response time",
  category: "utility",
  use: ".ping",
  fromMe: false,
  filename: __filename,

  execute: async (sock, msg) => {
    const start = Date.now();

    // First quick reply
    await sock.sendMessage(msg.key.remoteJid, { 
      text: "*⏳popkid xmd bot*" 
    });

    const latency = Date.now() - start;

    // Styled second reply
    await sock.sendMessage(
      msg.key.remoteJid,
      {
        text: `*🚀 Pinging...😊*\n\n*⚡ Speed:* ${latency}ms`
      },
      { quoted: msg }
    );
  }
};
