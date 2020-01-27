const GuildChannel = require('./GuildChannel');
const Textable = require('../interfaces/Textable');

/**
 * Class representing a text channel
 * @extends {GuildChannel}
 */
class TextChannel extends GuildChannel {

  constructor(data, guild) {
    super(data, guild);
    this.topic = data.topic;
    this.lastMessageID = data.last_message_id;
    this.rateLimitPerUser = data.rate_limit_per_users;
    this.lastPinTimestamp = data.last_pin_timestamp;
  }
}

Object.assign(TextChannel.prototype, Textable);

module.exports = TextChannel;
