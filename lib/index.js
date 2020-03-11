module.exports = {
  Client: require('./Client'),
  codec: require('./codec'),
  constants: require('./constants'),
  endpoints: require('./endpoints'),
  eventHandler: require('./eventHandler'),
  GatewayManager: require('./GatewayManager'),
  RESTManager: require('./RESTManager'),
  Shard: require('./Shard'),
  ...require('./structures'),
  ...require('./interfaces'),
  ...require('./util')
};
