const Base = require('./Base');

/**
 * Class representing a guild emoji
 * @extends {Base}
 */
class Emoji extends Base {

  constructor(data, guild) {
    super(data.id);
    const client = guild.shard.client;

    this.guild = guild;
    this.name = data.name;
    this.user = data.user ? client.users.add(data.user, client) : null;
    this.requireColons = data.require_colons;
    this.managed = data.managed;
    this.animiated = !!data.animiated;
    this._roles = data.roles;
  }

  get roles() {
    return this._roles.map((role) => this.guild.roles.get(role));
  }
}

module.exports = Emoji;
