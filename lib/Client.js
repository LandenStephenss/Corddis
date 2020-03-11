const Collection = require('./util/Collection');
const GatewayManager = require('./GatewayManager');
const RESTManager = require('./RESTManager');

const {
  Channel,
  Guild,
  User
} = require('./structures');

/**
 * Class representing a client
 */
class Client {
  channels = new Collection(Channel);
  guilds = new Collection(Guild);
  user = null;
  users = new Collection(User);

  /**
   * @arg {string} token Authentication bot token
   * @arg {ClientOptions} [options] Client options
   */
  constructor(token, options = {}) {
    Object.defineProperty(this, 'token', {
      value: `Bot ${token}`
    });
    this.messageLimit = options.messageLimit;
    this.gateway = new GatewayManager(this, options.gateway);
    this.rest = new RESTManager(this, options.rest);
  }
}

module.exports = Client;

/**
 * @typedef {object} ClientOptions
 * @prop {GatewayManagerOptions} [gateway] Gateway options
 * @prop {RestManagerOptions} [rest] REST options
 * @prop {number} [messageLimit] Number of messages to cache per channel
 */
