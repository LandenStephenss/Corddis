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
    this.nsfw = data.nsfw;
    this.parentID = data.parent_id;
  }

  get parent() {
    return this.guild.channels.get(this.parentID);
  }
}

module.exports = GuildChannel;
