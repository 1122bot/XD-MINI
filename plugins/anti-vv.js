// 🌟 coded by WHITESHADOW x Umar

const cooldown = new Map(); // anti spam

module.exports = {
  name: "vv",
  alias: ["viewonce", "view", "open"],
  category: "tools",

  async execute(client, message) {
    try {
      const chat = message.chat;
      const user = message.sender;
      const now = Date.now();

      // ⏳ anti spam (5 sec)
      const delay = 5000;
      if (cooldown.has(user)) {
        const last = cooldown.get(user);
        if (now - last < delay) {
          return await client.sendMessage(chat, {
            text: "*⏳ Thora ruk jao yar, spam mat karo 😅*"
          }, { quoted: message });
        }
      }
      cooldown.set(user, now);

      // react
      await client.sendMessage(chat, {
        react: { text: "🥺", key: message.key }
      });

      // reply check
      const quoted = message.quoted;
      if (!quoted) {
        return await client.sendMessage(chat, {
          text: "*KISI VIEW ONCE PHOTO / VIDEO / AUDIO PAR REPLY KARO 🥺*\n\n*Phir likho:* `vv`"
        }, { quoted: message });
      }

      // download media
      const buffer = await quoted.download();
      let msg = {};

      if (quoted.mtype === "imageMessage") {
        msg = {
          image: buffer,
          caption: quoted.text || ""
        };
      } 
      else if (quoted.mtype === "videoMessage") {
        msg = {
          video: buffer,
          caption: quoted.text || ""
        };
      } 
      else if (quoted.mtype === "audioMessage") {
        msg = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: quoted.ptt || false
        };
      } 
      else {
        return await client.sendMessage(chat, {
          text: "*YEH VIEW ONCE MEDIA NAHI HAI 🥺*"
        }, { quoted: message });
      }

      // send unlocked media
      await client.sendMessage(chat, msg, { quoted: message });

      // success react
      await client.sendMessage(chat, {
        react: { text: "😃", key: message.key }
      });

    } catch (err) {
      console.log("vv error:", err);
      await client.sendMessage(message.chat, {
        text: "❌ ERROR:\n" + err.message
      }, { quoted: message });
    }
  }
};
