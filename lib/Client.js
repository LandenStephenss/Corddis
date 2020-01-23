const GatewayManager = require('./GatewayManager');
const RESTManager = require('./RESTManager');

class Client {

  constructor(token) {
    this.token = token;
    this.gateway = new GatewayManager(this);
    this.rest = new RESTManager(this);
  }
}

module.exports = Client;
