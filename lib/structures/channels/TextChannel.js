const GuildChannel = require('./GuildChannel');
const MessageCollection = require('../../MessageCollection');
const util = require('../../util');

const {
  ChildChannel,
  Invitable,
  Textable
} = require('../../interfaces');

/**
 * Class representing a text channel
 * @extends {GuildChannel}
 */
class TextChannel extends GuildChannel {

  constructor(data, guild) {
    super(data, guild);
    const client = this.client = guild.shard.client;
    this.messages = new MessageCollection(client.messageLimit);

    this.update(data);
  }

  update(data) {
    super.update(data);
    this._update(data);
    this.topic = data.topic;
    this.nsfw = !!data.nsfw;
    this.lastMessageID = data.last_message_id;
    this.rateLimitPerUser = data.rate_limit_per_user;
    this.lastPinTimestamp = data.last_pin_timestamp || null;
  }
}

util.implement(TextChannel, ChildChannel, Invitable, Textable);

module.exports = TextChannel;
