const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

process.on("unhandledRejection", err => console.error(err));
process.on("uncaughtException", err => console.error(err));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// HOME = PAIR PAGE
app.get("/", (req, res) => {
  const pairFile = path.join(__dirname, "pair.html");
  if (fs.existsSync(pairFile)) {
    res.sendFile(pairFile);
  } else {
    res.status(500).send("pair.html file missing");
  }
});

// PAIR PAGE
app.get("/pair", (req, res) => {
  const pairFile = path.join(__dirname, "pair.html");
  if (fs.existsSync(pairFile)) {
    res.sendFile(pairFile);
  } else {
    res.status(500).send("pair.html file missing");
  }
});

// STATUS
app.get("/status", (req, res) => {
  res.send("🤖 Bilal MD Mini Bot is Running ✅");
});

// LOAD BOT ROUTER
try {
  const code = require("./index");
  app.use("/code", code.router);
} catch (e) {
  console.log("⚠️ index.js load skipped:", e.message);
}

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

module.exports = app;
