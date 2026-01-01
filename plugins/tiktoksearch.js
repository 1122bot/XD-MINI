const axios = require("axios");
const { cmd } = require("../command");
const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = require("@whiskeysockets/baileys");

/* ───── Fake Meta Quote ───── */
const fakeMeta = (from) => ({
  key: {
    participant: "13135550002@s.whatsapp.net",
    remoteJid: from,
    fromMe: false,
    id: "FAKE_META_TS"
  },
  message: {
    contactMessage: {
      displayName: "©WHITESHADOW-X",
      vcard: `BEGIN:VCARD
VERSION:3.0
N:Meta AI;;;;
FN:Meta AI
TEL;waid=13135550002:+1 313 555 0002
END:VCARD`,
      sendEphemeral: true
    }
  },
  pushName: "Meta AI",
  messageTimestamp: Math.floor(Date.now() / 1000)
});

/* ───── Shuffle Helper ───── */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ───── BILAL-MD TikTok Search ───── */
async function tiktokSearch(query) {
  const params = new URLSearchParams({
    keywords: query,
    count: "10",
    cursor: "0",
    HD: "1"
  });

  const { data } = await axios.post(
    "https://tikwm.com/api/feed/search",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        "Cookie": "current_language=en"
      }
    }
  );

  if (!data?.data?.videos?.length) return null;

  return data.data.videos.map(v => ({
    title: v.title || "No description",
    video: v.play
  }));
}

/* ───── Command ───── */
cmd({
  pattern: "tiktoksearch",
  alias: ["ts", "ttsearch", "tiks"],
  desc: "Search TikTok videos (carousel preview)",
  react: "🎵",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {

  if (!args.length) {
    return conn.sendMessage(from, {
      text: "🔎 *TikTok Search*\n\nUsage:\n.ts <keyword>"
    }, { quoted: fakeMeta(from) });
  }

  const query = args.join(" ");
  await store.react("⌛");

  try {
    const results = await tiktokSearch(query);
    if (!results) {
      await store.react("❌");
      return reply("❌ No TikTok videos found.");
    }

    const selected = shuffle(results).slice(0, 6);

    const cards = await Promise.all(
      selected.map(async (vid) => {
        const videoBuf = await axios.get(vid.video, { responseType: "arraybuffer" });
        const media = await prepareWAMessageMedia(
          { video: videoBuf.data },
          { upload: conn.waUploadToServer }
        );

        return {
          body: proto.Message.InteractiveMessage.Body.fromObject({ text: "" }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({
            text: "BILAL LITE 𝐁𝙾𝚃"
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: vid.title,
            hasMediaAttachment: true,
            videoMessage: media.videoMessage
          }),
          nativeFlowMessage:
            proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons: []
            })
        };
      })
    );

    const msg = generateWAMessageFromContent(from, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage:
            proto.Message.InteractiveMessage.fromObject({
              body: {
                text: `🔎 *TikTok Search Results*\n\n*Query:* ${query}`
              },
              footer: {
                text: "> 𝐏𝙾𝚆𝙴𝚁𝙳 𝐁𝚈 BILAL-𝐌𝙳"
              },
              header: { hasMediaAttachment: false },
              carouselMessage: { cards }
            })
        }
      }
    }, { quoted: fakeMeta(from) });

    await conn.relayMessage(from, msg.message, { messageId: msg.key.id });
    await store.react("✅");

  } catch (e) {
    console.error(e);
    await store.react("❌");
    reply("❌ TikTok search failed. Try again later.");
  }
});

// cnw-db-whiteshadow-md.zone.id//
