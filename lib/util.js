const util = require('util');

module.exports = {
  sleep: util.promisify(setTimeout)
};
