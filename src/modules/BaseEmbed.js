const { MessageEmbed } = require("discord.js");

function BaseEmbed(message) {
  if (!message) {
    throw Error("'message' must be passed down as param! (BaseEmbed)");
  }

  return new MessageEmbed()
    .setColor("#36393e")
}

module.exports = BaseEmbed;
