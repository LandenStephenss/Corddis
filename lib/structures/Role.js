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

  /**
   * Add a member to this role
   * @arg {string} memberID The member's ID
   * @returns {Promise<void>}
   */
  addMember(memberID) {
    return this.guild.addMemberRole(memberID, this.id);
  }

  /**
   * Remove a member from this role
   * @arg {string} memberID The member's ID
   * @returns {Promise<void>}
   */
  removeMember(memberID) {
    return this.guild.removeMemberRole(memberID, this.id);
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
