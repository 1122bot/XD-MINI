const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const router = express.Router();

const {
  default: makeWASocket,
  useMultiFileAuthState
} = require("@whiskeysockets/baileys");

process.on("unhandledRejection", err => console.error(err));
process.on("uncaughtException", err => console.error(err));

const SESSION_BASE = path.join(__dirname, "session");
if (!fs.existsSync(SESSION_BASE)) {
  fs.mkdirSync(SESSION_BASE, { recursive: true });
}

/*
|--------------------------------------------------------------------------
| PAIR ROUTE (MATCHES pair.html)
| /code?number=923xxxxxxxxx
|--------------------------------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    let number = req.query.number;

    if (!number) {
      return res.json({ error: "NUMBER_REQUIRED" });
    }

    number = number.replace(/[^0-9]/g, "");
    if (number.length < 10) {
      return res.json({ error: "INVALID_NUMBER" });
    }

    const sessionPath = path.join(SESSION_BASE, number);
    await fs.ensureDir(sessionPath);

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      browser: ["BILAL-MD", "Chrome", "1.0"]
    });

    sock.ev.on("creds.update", saveCreds);

    if (!sock.authState.creds.registered) {
      const pairingCode = await sock.requestPairingCode(number);
      console.log("PAIRING CODE:", pairingCode);
      return res.json({ code: pairingCode });
    }

    return res.json({ code: "ALREADY_PAIRED" });

  } catch (err) {
    console.error("PAIR ERROR:", err);
    return res.json({ error: "PAIR_FAILED" });
  }
});

module.exports = {
  router
};
