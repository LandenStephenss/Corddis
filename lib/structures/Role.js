const Base = require('./Base');

/**
 * Class representing a role
 * @extends {Base}
 */
class Role extends Base {

  constructor(data, guild) {
    super(data.id);
    this.guild = guild;

    this.update(data);
  }

  update(data) {
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.position = data.position;
    this.permissions = data.permissions;
    this.managed = data.managed;
    this.mentionable = data.mentionable;
  }
}

module.exports = Role;
