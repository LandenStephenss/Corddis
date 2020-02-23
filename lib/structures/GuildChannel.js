const Channel = require('./Channel');

/**
 * Class representing a guild channel
 * @extends {Channel}
 */
class GuildChannel extends Channel {

  constructor(data, guild) {
    super(data);
    this.guild = guild;

    this.update(data);
  }

  get parent() {
    return this._parentID ? this.guild.channels.get(this._parentID) || {
      id: this._parentID
    } : null;
  }

  update(data) {
    this.position = data.position;
    this.permissionOverwrites = data.permission_overwrites;
    this.name = data.name;
    this.nsfw = !!data.nsfw;
    this._parentID = data.parent_id;
  }
}

module.exports = GuildChannel;
