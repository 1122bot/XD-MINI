const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

process.on("unhandledRejection", err => console.error("Unhandled:", err));
process.on("uncaughtException", err => console.error("Uncaught:", err));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ HOME = PAIR PAGE (SAFE CHECK)
app.get("/", (req, res) => {
  const pairPage = path.join(__dirname, "pair.html");
  if (fs.existsSync(pairPage)) {
    res.sendFile(pairPage);
  } else {
    res.status(500).send("❌ pair.html file missing");
  }
});

// ✅ /pair ALSO OPENS PAIR PAGE
app.get("/pair", (req, res) => {
  const pairPage = path.join(__dirname, "pair.html");
  if (fs.existsSync(pairPage)) {
    res.sendFile(pairPage);
  } else {
    res.status(500).send("❌ pair.html file missing");
  }
});

// ✅ STATUS CHECK
app.get("/status", (req, res) => {
  res.send("🤖 Bilal MD Mini Bot is Running ✅");
});

// ✅ LOAD BOT ROUTER SAFELY
try {
  const code = require("./index"); // MUST BE lib/index.js
  if (code && code.router) {
    app.use("/code", code.router);
  } else {
    console.log("⚠️ index.js loaded but router not found");
  }
} catch (e) {
  console.log("⚠️ index.js load skipped:", e.message);
}

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

module.exports = app;
