const Collection = require('./Collection');
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
    this.gateway = new GatewayManager(this, options.gateway);
    this.rest = new RESTManager(this, options.rest);
  }
}

module.exports = Client;

/**
 * @typedef {object} ClientOptions
 * @prop {GatewayManagerOptions} [gatewayOptions] Gateway options
 * @prop {RestManagerOptions} [restOptions] REST options
 */
