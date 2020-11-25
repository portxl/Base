const { model, Schema } = require("mongoose");

const guildSchema = new Schema({
  guild_id: { type: String, required: true },
  prefix: { type: String, default: "/" },
  locale: { type: String, default: "english" },
});

module.exports = model("Guild", guildSchema);
