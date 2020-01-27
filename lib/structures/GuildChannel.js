const Channel = require('./Channel');

/**
 * Class representing a guild channel
 * @extends {Channel}
 */
class GuildChannel extends Channel {

  constructor(data, guild) {
    super(data);
    this.guild = guild;
    this.position = data.position;
    this.permissionOverwrites = data.permission_overwrites;
    this.name = data.name;
    // this.topic = data.topic;
    this.nsfw = data.nsfw;
    // this.lastMessageID = data.last_message_id;
    // this.bitrate = data.bitrate;
    // this.userLimit = data.user_limit;
    // this.rateLimitPerUser = data.rate_limit_per_user;
    // this.recipients = data.recipients;
    // this.icon = data.icon;
    // this.ownerID = data.owner_id;
    this.parentID = data.parentID;
    // this.lastPinTimestamp = data.last_pin_timestamp;
  }

  get parent() {
    return this.guild.Channels.get(this.parentID);
  }
}

module.exports = GuildChannel;
