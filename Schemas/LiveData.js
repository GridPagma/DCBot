const { StringSelectMenuBuilder } = require("@discordjs/builders");
const { model, Schema } = require("mongoose");

module.exports = model(
  "LiveData",
  new Schema({
    Guild: String,
    LogChannel: String,
    LiveChannel: String,
    LIVE: Boolean,
    TRACKING: Boolean,
    Streamer: String,
  })
);
