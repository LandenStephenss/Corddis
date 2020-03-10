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

  deletePermission() {}

  getWebhooks() {}

  editPermissionOverwrite() {}

  update(data) {
    this.position = data.position;
    this.permissionOverwrites = data.permission_overwrites;
    this.name = data.name;
  }
}

module.exports = GuildChannel;
