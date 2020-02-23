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

  get roles() {
    return this._roles.map((role) => this.guild.roles.get(role));
  }

  get voiceState() {
    return this.guild.voiceStates.get(this.id) || null;
  }

  get presence() {
    return this.guild.presences.get(this.id) || null;
  }

  /**
   * Kick this member
   * @arg {string} [reason] Reason for the kick
   * @returns {Promise<void>}
   */
  kick(reason) {
    return this.guild.kickMember(this.id, reason);
  }

  /**
   * Ban this member
   * @arg {BanMemberOptions} [options] Ban member options
   * @returns {Promise<void>}
   */
  ban(options) {
    return this.guild.banMember(this.id, options);
  }

  /**
   * Unban this member
   * @returns {Promise<void>}
   */
  unban() {
    return this.guild.unbanUser(this.id);
  }

  update(data) {
    this.nick = data.nick;
    this.joinedAt = data.joined_at;
    this.premiumSince = data.premium_since || null;
    this._roles = data.roles;
  }
}

module.exports = Member;
