module.exports = {
  command: "vv",
  desc: "Unlock view-once or private media",
  category: "owner",
  use: ".vv (reply to media)",
  fromMe: false,
  filename: __filename,

  execute: async (sock, msg, { isCreator, quoted }) => {
    const jid = msg.key.remoteJid;

    // ❌ First we check owner
    if (!isCreator) {
      return await sock.sendMessage(
        jid,
        { text: "*🚫 Owner only command 😊*" },
        { quoted: msg }
      );
    }

    // Now owner passed – show loading msg
    await sock.sendMessage(jid, { text: "*⏳ Loading... 🥺*" });

    // Must reply to media
    if (!quoted) {
      return await sock.sendMessage(
        jid,
        {
          text:
          "*🚀 View-Once Unlock 😊*\n\n" +
          "Reply to a *view-once or private* media, then use:\n\n" +
          "`.vv`"
        },
        { quoted: msg }
      );
    }

    await sock.sendMessage(jid, { text: "*🚀 Unlocking... 😊*" });

    try {
      const buffer = await quoted.download();
      const mtype = quoted.mtype;
      let content = {};

      if (mtype === "imageMessage") {
        content = {
          image: buffer,
          caption: quoted.text || ""
        };
      } 
      else if (mtype === "videoMessage") {
        content = {
          video: buffer,
          caption: quoted.text || ""
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
          { text: "*⚠️ Reply to a view-once image/video/audio 🥺*" },
          { quoted: msg }
        );
      }

      await sock.sendMessage(jid, content, { quoted: msg });
      await sock.sendMessage(jid, { text: "*BILAL-MD Unlocked 😎*" });

    } catch (err) {
      await sock.sendMessage(
        jid,
        { text: "*❌ Unlock failed 😔*\n" + err.message },
        { quoted: msg }
      );
    }
  }
};
