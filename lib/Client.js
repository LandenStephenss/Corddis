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
    Object.defineProperty(this, '_token', {
      value: token
    });
    this.tokenType = options.tokenType || 'Bot';
    this.gateway = new GatewayManager(this, options.gateway);
    this.rest = new RESTManager(this, options.rest);
  }

  get token() {
    return `${this.tokenType} ${this._token}`;
  }
}

module.exports = Client;

/**
 * @typedef {object} ClientOptions
 * @prop {string} [tokenType] Type of token
 * @prop {GatewayManagerOptions} [gateway] Gateway options
 * @prop {RestManagerOptions} [rest] REST options
 */
