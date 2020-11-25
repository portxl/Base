const moment = require("moment");
const chalk = require("chalk");

class Logger {
  now() {
    return moment().format("hh:mm:ss");
  }

  /**
   * @param {string} type
   * @param {string} error
   */
  error(type, error) {
    return console.error(
      chalk.red(`[Client] ${type}: ${error}`)
    );
  }

  warn(type, warning) {
    return console.warn(
      chalk.yellow(`[Client] ${type}: ${warning}`)
    );
  }

  /**
   * @param {string} type
   * @param {string} message
   */
  log(type, message) {
    return console.log(`[Client] ${type}: ${message}`);
  }
}

module.exports = new Logger();
