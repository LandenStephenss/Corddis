const GuildChannel = require('./GuildChannel');
const util = require('../../util');

const {
  ChildChannel
} = require('../../interfaces');

/**
 * Class representing a store channel
 * @extends {GuildChannel}
 */
class StoreChannel extends GuildChannel {
}

util.implement(StoreChannel, ChildChannel);

module.exports = StoreChannel;
