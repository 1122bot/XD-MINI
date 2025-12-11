module.exports = {
  command: "vv",
  desc: "Unlock view-once or private media",
  category: "owner",
  use: ".vv (reply to media)",
  fromMe: false,
  filename: __filename,

  execute: async (sock, msg, { isCreator, quoted }) => {
    const jid = msg.key.remoteJid;

    // First reply (same style as ping)
    await sock.sendMessage(jid, { 
      text: "*⏳ loading 🥺*" 
    });

    // Owner check
    if (!isCreator) {
      return await sock.sendMessage(
        jid,
        { text: "*🚫 Owner only command 😊*" },
        { quoted: msg }
      );
    }

    // Must reply to a media message
    if (!quoted) {
      return await sock.sendMessage(
        jid,
        {
          text:
            "*🚀 View-Once Unlock...😊*\n\n" +
            "Reply to a *view-once or private* image, video, or audio,\n" +
            "then type:  `.vv`"
        },
        { quoted: msg }
      );
    }

    // Processing message (ping style)
    await sock.sendMessage(jid, { 
      text: "*🚀 Unlocking...😊*" 
    });

    try {
      // Download content correctly
      const buffer = await quoted.download();
      const mtype = quoted.mtype;

      let content = {};

      if (mtype === "imageMessage") {
        content = {
          image: buffer,
          caption: quoted.text || "",
          mimetype: quoted.mimetype || "image/jpeg"
        };
      }
      else if (mtype === "videoMessage") {
        content = {
          video: buffer,
          caption: quoted.text || "",
          mimetype: quoted.mimetype || "video/mp4"
        };
      }
      else if (mtype === "audioMessage") {
        content = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: quoted.ptt || false
        };
      }
      else {
        return await sock.sendMessage(
          jid,
          { text: "*⚠️ Reply to a view-once image, video or audio 🥺*" },
          { quoted: msg }
        );
      }

      // Send unlocked media
      await sock.sendMessage(jid, content, { quoted: msg });

      // Done message (same style as ping)
      await sock.sendMessage(jid, { 
        text: "*✅ Done...😃*" 
      });

    } catch (err) {
      await sock.sendMessage(
        jid,
        { text: "*❌ Error...😔*\n" + err.message },
        { quoted: msg }
      );
    }
  }
};
