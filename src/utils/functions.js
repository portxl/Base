const Guild = require("../models/Guild.model");
const BaseEmbed = require("../modules/BaseEmbed");
const moment = require("moment");

/**
 * @param {string} guildId
 */
async function getGuildById(guildId) {
  try {
    let guild = await Guild.findOne({ guild_id: guildId });

    if (!guild) {
      guild = await addGuild(guildId);
    }

    return guild;
  } catch (e) {
    console.error(e);
  }
}

/**
 * @param {string} guildId
 * @param {object} settings
 */
async function updateGuildById(guildId, settings) {
  try {
    if (typeof settings !== "object") {
      throw Error("'settings' must be an object");
    }

    const guild = await getGuildById(guildId);

    if (!guild) {
      await addGuild(guildId);
    }

    await Guild.findOneAndUpdate({ guild_id: guildId }, settings);
  } catch (e) {
    console.error(e);
  }
}

async function addGuild(guildId) {
  try {
    const guild = new Guild({ guild_id: guildId });

    await guild.save();

    return guild;
  } catch (e) {
    console.error(e);
  }
}

async function removeGuild(guildId) {
  try {
    await Guild.findOneAndDelete({ guild_id: guildId });
  } catch (e) {
    console.error(e);
  }
}

/**
 * @param {Array} permissions
 * @param {Object} message
 */
const errorEmbed = (permissions, message) => {
  return BaseEmbed(message)
    .setDescription(
      `I need ${permissions.map((p) => `\`${p}\``).join(", ")} permissions!`
    )
};

async function getGuildLang(guildId) {
  try {
    const guild = await getGuildById(guildId);

    return require(`../locales/${guild?.locale || "english"}`);
  } catch (e) {
    console.error(e);
  }
}

const formatDate = (date) => moment(date).format("MM/DD/YYYY");

const toCapitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);


module.exports = {
  errorEmbed,
  formatDate,
  toCapitalize,
  addGuild,
  getGuildById,
  updateGuildById,
  removeGuild,
  getGuildLang,
};
