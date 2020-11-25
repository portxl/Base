const { readdirSync } = require("fs");
// eslint-disable-next-line no-unused-vars
const Logger = require("./Logger");

module.exports = function loadEvents(bot) {
  const eventFiles = readdirSync("./src/events/").filter((file) =>
    file.endsWith(".js")
  );

  eventFiles.forEach((file) => {
    const event = require(`../events/${file}`);

    if (!event.execute) {
      throw new TypeError(
        `[Client] Error: Execute function is required for events! (${file})`
      );
    }

    if (!event.name) {
      throw new TypeError(`[Client] Error: Name is required for events! (${file})`);
    }
      
    bot.on(event.name, event.execute.bind(null, bot));
    
    delete require.cache[require.resolve(`../events/${file}`)];
  });
};
