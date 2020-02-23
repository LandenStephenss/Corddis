const Collection = require('../Collection');
const GuildChannel = require('./GuildChannel');
const Message = require('./Message');

const {
  Invitable,
  Textable
} = require('../interfaces');

/**
 * Class representing a text channel
 * @extends {GuildChannel}
 */
class TextChannel extends GuildChannel {

  constructor(data, guild) {
    super(data, guild);
    this.client = guild.shard.client;
    this.messages = new Collection(Message);

    this.update(data);
  }

  update(data) {
    super.update(data);
    this.topic = data.topic;
    this.lastMessageID = data.last_message_id;
    this.rateLimitPerUser = data.rate_limit_per_user;
    this.lastPinTimestamp = data.last_pin_timestamp || null;
  }
}

Object.assign(TextChannel.prototype, Invitable, Textable);

module.exports = TextChannel;
