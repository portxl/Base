require("./utils/checkValid")();
require("./utils/database");
const chalk = require("chalk");
const { Collection, Client } = require("discord.js");
const { token } = require("../config.json");
const { getGuildLang } = require("./utils/functions");

const bot = new Client({ disableMentions: "everyone" });

bot.getGuildLang = getGuildLang;
bot.commands = new Collection();
bot.aliases = new Collection();
bot.cooldowns = new Collection();

require("moment-duration-format");
require("./modules/command")(bot);
require("./modules/events")(bot);

bot.login(token);

process.on("unhandledRejection", (error) =>
  console.error(chalk.redBright("Uncaught Error "), error)
);

process.on("uncaughtExceptionMonitor", (error) => {
  console.error(chalk.redBright("Uncaught Exception "), error);
});

process.on("warning", (warning) => {
  console.warn(chalk.yellow("Warning "), warning);
});
