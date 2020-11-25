const { connect, connection } = require("mongoose");
const { mongodbUri } = require("../../config.json");
const Logger = require("../modules/Logger");

(async function database() {
  const uri = mongodbUri;

  try {
    await connect(uri, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    Logger.log("Database", "Connection with database, done with succes!");
  } catch (e) {
    Logger.error("Database", e);
  }

  connection.on("disconnected", () => {
    console.error("Disconnected from mongoose database!");
  });
})();
