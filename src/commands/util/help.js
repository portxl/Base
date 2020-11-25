const { getGuildById } = require("../../utils/functions");
const BaseEmbed = require("../../modules/BaseEmbed");
const categories = require("../../data/categories.json");
const { stripIndents } = require('common-tags');

module.exports = {
  name: "help",
  description: "Shows all commands or shows more info about a command.",
  category: "util",
  cooldown: 2,
  usage: "h <category name | command name>",
  aliases: ["h"],
  async execute(bot, message, args) {
    const lang = await bot.getGuildLang(message.guild.id);
    const guild = await getGuildById(message.guild.id);
    const prefix = guild.prefix;
    const cmdArgs = args[0];
    const all = (args[0] === 'all') ? args[0] : '';
    const size = bot.commands.size;

    if (categories.includes(cmdArgs)) {
      const cmds = bot.commands
        .filter((com) => com.category === cmdArgs)
        .map((cmd) => cmd.name)
        .join(", ");

      if (cmds.length < 0) {
        return message.channel.send(lang.HELP.CAT_NOT_EXIST);
      }

      const embed = BaseEmbed(message).setTitle(
        `${lang.HELP.COMMANDS}: ${cmdArgs}`
      );

      return message.channel.send({ embed });
    } else if (cmdArgs) {
      const cmd =
        bot.commands.get(cmdArgs) || bot.commands.get(bot.aliases.get(cmdArgs));
      if (!cmd) return message.channel.send(lang.HELP.CMD_NOT_FOUND);

      const aliases = cmd.aliases
        ? cmd.aliases.map((alias) => alias)
        : lang.GLOBAL.NONE;
      const options = cmd.options
        ? cmd.options.map((option) => option)
        : lang.GLOBAL.NONE;
      const cooldown = cmd.cooldown ? `${cmd.cooldown}s` : lang.GLOBAL.NONE;
      const memberPerms = !cmd.memberPermissions
        ? lang.GLOBAL.NONE
        : [...cmd.memberPermissions].map((p) => p);

      const botPerms = !cmd.botPermissions
        ? ["SEND_MESSAGES"].map((p) => p)
        : [...cmd.botPermissions, "SEND_MESSAGES"].map((p) => p);

      const embed = BaseEmbed(message)
        .setTitle(cmd.name)
        .setThumbnail(bot.user.avatarURL({ dynamic: true, size: 2048, format: 'png' }))
        .setDescription(cmd.description ? cmd.description : lang.HELP.NOT_DESC)
        .addField(`**${lang.HELP.CATEGORY}**:`, cmd.category, true)
        .addField(`**${lang.HELP.ALIASES}**:`, aliases, true)
        .addField(
          `**${lang.HELP.USAGE}**:`,
          cmd.usage ? `${prefix}${cmd.usage}` : lang.GLOBAL.NOT_SPECIFIED,
          true
        )
        .addField(`**${lang.HELP.COOLDOWN}**:`, `${cooldown}`, true)
        .addField(`**${lang.HELP.OPTIONS}**:`, options, true)
        .addField(`**${lang.HELP.BOT_PERMS}**:`, botPerms, true)
        .addField(`**${lang.HELP.USER_PERMS}**:`, memberPerms, true);

      return message.channel.send(embed);
    }

    const commands = bot.commands;

    const utilsCmds = commands
      .filter(({ category }) => category === "util")
      .map(({ name }) => name)
      .join(", ");
    const adminCmds = commands
      .filter(({ category }) => category === "admin")
      .map(({ name }) => name)
      .join(", ");
    const modCmds = commands
      .filter(({ category }) => category === "mod")
      .map(({ name }) => name)
      .join(", ");

    const embed = BaseEmbed(message)
      .setThumbnail(bot.user.avatarURL({ dynamic: true, size: 2048, format: 'png' }))
      .setDescription(stripIndents`
        ${lang.HELP.DESC_FIRST}
 
        **${lang.HELP.ADMIN}** <:charliewave_admin:771632435040878624>
        ${adminCmds}

        **${lang.HELP.UTIL}** <:charliewave_general:771633361340727336>
        ${utilsCmds}

        **${lang.HELP.MOD}** <:charliewave_mod:771632703006179328>
        ${modCmds}
        
        ${lang.HELP.CMD_DESC} \`${prefix}\`
        ${lang.HELP.MORE_INFO} \`${prefix}help <command>\``)
        .setFooter(
          (!all && size) ? 
            'Available commands.\n' + message.member.displayName : message.member.displayName, 
          message.author.displayAvatarURL({ dynamic: true })
        )

    message.channel.send(embed);

  },
};
