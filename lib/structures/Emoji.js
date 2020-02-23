const Base = require('./Base');

/**
 * Class representing a guild emoji
 * @extends {Base}
 */
class Emoji extends Base {

  constructor(data, guild) {
    super(data.id);
    const client = guild.shard.client;

    this.user = data.user ? client.users.add(data.user, client) : null;

    this.update(data);
  }

  get roles() {
    return this._roles.map((role) => this.guild.roles.get(role));
  }

  update(data) {
    this.name = data.name;
    this.requireColons = data.require_colons;
    this.managed = data.managed;
    this.animiated = !!data.animiated;
    this._roles = data.roles;
  }
}

module.exports = Emoji;
