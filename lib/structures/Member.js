const Base = require('./Base');

/**
 * Class representing a member
 * @extends {Base}
 */
class Member extends Base {

  constructor(data, guild) {
    super(data.user.id);
    const client = guild.shard.client;

    this.guild = guild;
    this.user = client.users.add(data.user, client);

    this.update(data);
  }

  get presence() {
    return this.guild.presences.get(this.id) || null;
  }

  get roles() {
    return this._roles.map((role) => this.guild.roles.get(role));
  }

  get voiceState() {
    return this.guild.voiceStates.get(this.id) || null;
  }

  /**
   * Add a role to this member
   * @arg {string} roleID The role's ID
   * @returns {Promise<void>}
   */
  addRole(roleID) {
    return this.guild.addMemberRole(this.id, roleID);
  }

  /**
   * Ban this member
   * @arg {BanMemberOptions} [options] Ban member options
   * @returns {Promise<void>}
   */
  ban(options) {
    return this.guild.banMember(this.id, options);
  }

  edit() {}

  /**
   * Kick this member
   * @arg {string} [reason] Reason for the kick
   * @returns {Promise<void>}
   */
  kick(reason) {
    return this.guild.kickMember(this.id, reason);
  }

  /**
   * Remove a role from this member
   * @arg {string} roleID The role's ID
   * @returns {Promise<void>}
   */
  removeRole(roleID) {
    return this.guild.removeMemberRole(this.id, roleID);
  }

  /**
   * Unban this member
   * @arg {string} [reason] Reason for the unban
   * @returns {Promise<void>}
   */
  unban(reason) {
    return this.guild.unbanUser(this.id, reason);
  }

  update(data) {
    this.nick = data.nick;
    this.joinedAt = data.joined_at;
    this.premiumSince = data.premium_since || null;
    this._roles = data.roles;
  }
}

module.exports = Member;
