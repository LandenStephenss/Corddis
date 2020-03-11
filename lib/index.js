module.exports = {
  Client: require('./Client'),
  codec: require('./codec'),
  Collection: require('./Collection'),
  constants: require('./constants'),
  CorddisEmitter: require('./CorddisEmitter'),
  CorddisEvent: require('./CorddisEvent'),
  endpoints: require('./endpoints'),
  eventHandler: require('./eventHandler'),
  GatewayManager: require('./GatewayManager'),
  logger: require('./logger'),
  MessageCollection: require('./MessageCollection'),
  RESTManager: require('./RESTManager'),
  Shard: require('./Shard'),
  util: require('./util'),
  ...require('./structures'),
  ...require('./interfaces')
};
