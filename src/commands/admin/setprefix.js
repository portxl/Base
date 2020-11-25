const { getGuildById, updateGuildById } = require("../../utils/functions");
const { ownerId } = require("../../../config.json");

module.exports = {
  name: "setprefix",
  description: "Set a prefix for your server",
  aliases: ["prefix"],
  category: "exempt",
  memberPermissions: ["ADMINISTRATOR"],
  async execute(bot, message, args) {
    const prefix = args[0];
    const lang = await bot.getGuildLang(message.guild.id);
    const guild = await getGuildById(message.guild.id);

    if (!prefix)
      return message.channel.send(lang.ADMIN.PREFIX.replace("{prefix}", guild.prefix));

    if (message.author.id === ownerId) {
      setPrefix(message, prefix);
    } else if (message.member.permissions.has(["MANAGE_GUILD"])) {
      setPrefix(message, prefix);
    } else {
      return message.channel.send(lang.ADMIN.PREFPERMS);
    }

async function setPrefix(message, prefix) {
  await updateGuildById(message.guild.id, { prefix });
  message.channel.send(lang.ADMIN.PERFCHANGE.replace("{prefix}", prefix));
}

},
};