module.exports = {
  Client: require('./Client'),
  codec: require('./codec'),
  Collection: require('./Collection'),
  constants: require('./constants'),
  GatewayManager: require('./GatewayManager'),
  RESTManager: require('./RESTManager'),
  Shard: require('./Shard'),
  util: require('./util'),
  ...require('./structures')
};
