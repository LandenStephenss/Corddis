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
  gateway = new GatewayManager(this);
  rest = new RESTManager(this);
  channels = new Collection(Channel);
  guilds = new Collection(Guild);
  user = null;
  users = new Collection(User);
  _unavailableGuilds = new Map();

  /**
   * @arg {string} token Authentication bot token
   */
  constructor(token) {
    Object.defineProperty(this, 'token', {
      value: token
    });
  }
}

module.exports = Client;
