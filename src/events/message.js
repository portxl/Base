const { getGuildById, getSticky, getUserById, updateUserById, errorEmbed, calculateUserXp } = require("../utils/functions");
const queue = new Map();
const { owners } = require("../../config.json");

module.exports = {
  name: "message",
  async execute(bot, message) {
    if (message.channel.type === "dm") return;
    if (!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES"))
      return;

    const guildId = message.guild.id;
    const userId = message.author.id;
    const cooldowns = bot.cooldowns;
    const guild = await getGuildById(guildId);
    const lang = await bot.getGuildLang(message.guild.id);

    const ignoredChannels = guild?.ignored_channels;
    if (ignoredChannels.includes(message.channel.id)) return;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const serverPrefix = guild.prefix;
    const prefix = new RegExp(
      `^(<@!?${bot.user.id}>|${escapeRegex(serverPrefix)})\\s*`
    );

    if (
      !prefix.test(message.content) ||
      message.author.bot ||
      userId === bot.user.id
    )
      return;

    const [, matchedPrefix] = message.content.match(prefix);
    const args = message.content
      .slice(matchedPrefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    const customCmds = guild?.custom_commands;

    if (message.mentions.has(bot.user.id) && !command) {
      message.channel.send(`Prefix: \`${serverPrefix}\``);
    }


    try {
      const cmd =
        bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));

      if (bot.commands.has(cmd?.name)) {
        const now = Date.now();
        const timestamps = cooldowns.get(cmd.name);
        const cooldownAmount = cmd.cooldown * 1000;

        if (cmd.ownerOnly && !owners.includes(message.author.id)) {
          return message.channel.send(lang.GLOBAL.OWNERONLY);
        }

        if (cmd.botPermissions) {
          const neededPermissions = [];
          cmd.botPermissions.forEach((perm) => {
            if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
              neededPermissions.push(perm);
            }
          });

          if (neededPermissions[0]) {
            return message.channel.send(errorEmbed(neededPermissions, message));
          }
        }

        if (cmd.memberPermissions) {
          const neededPermissions = [];
          cmd.memberPermissions.forEach((perm) => {
            if (!message.channel.permissionsFor(message.member).has(perm)) {
              neededPermissions.push(perm);
            }
          });

          if (neededPermissions.length > 0) {
            return message.channel.send(lang.GLOBAL.PERMSUNEED.replace("{map}", neededPermissions
            .map((p) => `\`${p.toUpperCase()}\``)
            .join(", "))
            );
          }
        }

        if (cmd.nsfwOnly && cmd.nsfwOnly === true && !message.channel.nsfw) {
          return message.channel.send(lang.GLOBAL.NOSFW);
        }

        if (timestamps.has(userId)) {
          const expTime = timestamps.get(userId) + cooldownAmount;

          if (now < expTime) {
            const timeleft = (expTime - now) / 1000;
            return message.channel.send(lang.GLOBAL.COOLDOWN.replace("{timeleft}", timeleft.toFixed(1)).replace("{command}", cmd.name)
            );
          }
        }

        timestamps.set(userId, now);
        setTimeout(() => timestamps.delete(userId), cooldownAmount);

        cmd.execute(bot, message, args, queue);
      } else {
        return;
      }
    } catch (e) {
      console.log({ message: message.content, e });
    }
  },
};
