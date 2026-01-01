const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

process.on("unhandledRejection", err => console.error(err));
process.on("uncaughtException", err => console.error(err));

const app = express();
const PORT = process.env.PORT || 3000;

// body parser FIRST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SAFE REQUIRE
let code;
try {
  code = require("./index");
  app.use("/code", code.router || ((req, res) => res.send("Bot running")));
} catch (e) {
  console.log("index.js load skipped:", e.message);
}

// HTML routes
app.get("/pair", (req, res) => {
  res.sendFile(path.join(__dirname, "pair.html"));
});

app.get("/", (req, res) => {
  res.send("BILAL MD BOT RUNNING ✅");
});

// LISTEN
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

module.exports = app;
