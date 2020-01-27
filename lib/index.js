module.exports = {
  Client: require('./Client'),
  Collection: require('./Collection'),
  GatewayManager: require('./GatewayManager'),
  RESTManager: require('./RESTManager'),
  Shard: require('./Shard'),
  ...require('./structures')
};
