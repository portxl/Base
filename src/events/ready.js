const Logger = require("../modules/Logger");
const date = new Date();

module.exports = {
  name: "ready",
  execute(bot) {
    const serverCount = bot.guilds.cache.size;
    const channelCount = bot.channels.cache.size;
    const userCount = bot.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    const commandsCount = bot.commands.size;
    const statuses = [
      `${serverCount} guilds`,
      `${userCount} users`,
      `${channelCount} channels`,
      `${commandsCount} commands`
    ];

    Logger.log(
      "Info",
      `Bot is running well on ${serverCount} guilds (${userCount} users) and ${channelCount} channels!`
    );

    console.log(
      `Loaded ${commandsCount} commands.`
    )
    console.log(
      `Charliewave is online.\n${(date.getMonth() + 1).toString().padStart(2, '0')}/${
        date.getDate().toString().padStart(2, '0')}/${
        date.getFullYear().toString().padStart(4, '0')} ${
        date.getHours().toString().padStart(2, '0')}:${
        date.getMinutes().toString().padStart(2, '0')}:${
        date.getSeconds().toString().padStart(2, '0')}`
    )
    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      bot.user.setActivity(status, { type: "WATCHING" });
    }, 60000);
  },
};
