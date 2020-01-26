const GatewayManager = require('./GatewayManager');
const RESTManager = require('./RESTManager');

const Guild = require('./structures/Guild');
const User = require('./structures/User');

const Collection = require('./Collection');

class Client {

  constructor(token) {
    Object.defineProperty(this, 'token', {
      value: token
    });
    this.gateway = new GatewayManager(this);
    this.rest = new RESTManager(this);
    this.channels = new Map();
    this.guilds = new Collection(Guild);
    this.user = null;
    this.users = new Collection(User);
    this._unavailableGuilds = new Map();
  }
}

module.exports = Client;
