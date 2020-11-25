const fs = require("fs");
const { sep } = require("path");
const chalk = require("chalk");
const { Collection } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Logger = require("./Logger");

module.exports = function loadCommands(bot) {
  const dir = "./src/commands";
  fs.readdirSync(dir).forEach((dirs) => {
    const commands = fs
      .readdirSync(`${dir}${sep}${dirs}${sep}`)
      .filter((f) => f.endsWith(".js"));

    for (const file of commands) {
      const cmd = require(`../commands/${dirs}/${file}`);

      if (!cmd.execute)
        throw new TypeError(
          `[Client] Error: Execute function is required for commands! (${file})`
        );

      if (!cmd.name)
        throw new TypeError(
          `[Client] Error: Name is required for commands! (${file})`
        );

      if (cmd.name.trim() === "")
        throw new TypeError(
          `[Client] Error: Name cannot be empty! (${file})`
        );

      if (!cmd.category)
        console.warn(
          chalk.yellow(
            `[Client]: Info: Command ${cmd.name} will not be shown in the help command because no category is set.`
          )
        );

      if (cmd.aliases) {
        for (const alias of cmd.aliases) {
          bot.aliases.set(alias, cmd.name);
        }
      }

      bot.commands.set(cmd.name, cmd);

      const cooldowns = bot.cooldowns;

      if (!cooldowns.has(cmd.name)) {
        cooldowns.set(cmd.name, new Collection());
      }
    }
  });
};
