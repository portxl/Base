const config = require("../../config.json");
const Logger = require("../modules/Logger");

function checkValid() {
  const v = parseFloat(process.versions.node);

  if (v < 14) {
    throw Error(
      "[Client] This bot requires version 14 of nodejs! Please upgrade to version 14"
    );
  }

  if (config.token === "") {
    throw Error("[Client] Bot token is required");
  }

  if (config.mongodbUri === "") {
    throw Error("[Client] mongoUri is required");
  }

  if (!config.owners[0]) {
    Logger.warn("Info", "ownerId is required for bot-owner commands");
  }
}

module.exports = checkValid;
