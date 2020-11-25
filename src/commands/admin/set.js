/* eslint-disable no-case-declarations */
const { updateGuildById } = require("../../utils/functions");
const { getGuildById } = require("../../utils/functions");
const fs = require("fs");

const languages = fs
  .readdirSync("./src/locales/")
  .filter((f) => f.endsWith(".js"))
  .map((la) => la.slice(0, -3));

module.exports = {
  name: "set",
  description: "Set the value for configurable options.",
  category: "admin",
  usage: "set <option> <channel/variable>",
  options: [
    "language",
  ],
  memberPermissions: ["ADMINISTRATOR"],
  async execute(bot, message, args) {
    const guildId = message.guild.id;
    const option = args[0];
    const item = message.mentions.channels.first() || message.mentions.roles.first();
    const language = args[1];
    const lang = await bot.getGuildLang(message.guild.id);
    
    if (!option) {
      return message.channel.send(lang.ADMIN.PROVIDE_SETVAR);
    }

    if (
      !["level-messages", "language"].includes(option.toLowerCase()) &&
      !item
    ) {
      return message.channel.send(lang.ADMIN.PROVIDE_ROLE_OR_CHANNEL);
    }

    switch (option.toLowerCase()) {
      case "language": {
        if (!language) {
          return message.channel.send(lang.ADMIN.PROVIDE_LANG);
        }
        if (!languages.includes(language)) {
          return message.channel.send(lang.ADMIN.LANGSACTIVE.replace("{map}", languages.map(
            (l) => `\`${l}\``
          ).join(", "))
          );
        }
        updateItem("locale", language, guildId);
        message.channel.send(lang.ADMIN.CHANGED_LANG.replace("{language}", language));
        break;
      }
      default:
        return message.channel.send(lang.GLOBAL.NOT_AN_OPTION.replace("{option}", option));
    }
  },
};

async function updateItem(type, item, guildId) {
  await updateGuildById(guildId, {
    [type]: item,
  });
}
