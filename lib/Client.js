const GatewayManager = require('./GatewayManager');
const RESTManager = require('./RESTManager');

class Client {

  constructor(token) {
    this.token = token;
    this.gateway = new GatewayManager(this);
    this.rest = new RESTManager(this);
    this.channels = new Map();
    this.guilds = new Map();
    this.user = null;
    this.users = new Map();
  }
}

module.exports = Client;
