const Collection = require('./Collection');
const GatewayManager = require('./GatewayManager');
const RESTManager = require('./RESTManager');

const {
  Channel,
  Guild,
  User
} = require('./structures');

class Client {

  constructor(token) {
    Object.defineProperty(this, 'token', {
      value: token
    });
    this.gateway = new GatewayManager(this);
    this.rest = new RESTManager(this);
    this.channels = new Collection(Channel);
    this.guilds = new Collection(Guild);
    this.user = null;
    this.users = new Collection(User);
    this._unavailableGuilds = new Map();
  }
}

module.exports = Client;
