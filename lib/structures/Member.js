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
    this.nick = data.nick;
    this.joinedAt = data.joined_at;
    this.premiumSince = data.premium_since;
    this._roles = data.roles;
  }

  get roles() {
    return this._roles.map((role) => this.guild.roles.get(role));
  }

  get voiceState() {
    return this.guild.voiceStates.get(this.id) || null;
  }

  /**
   * Kick this member
   * @returns {Promise<void>}
   */
  kick() {
    return this.guild.kickMember(this.id);
  }

  /**
   * Ban this member
   * @returns {Promise<void>}
   */
  ban() {
    return this.guild.banMember(this.id);
  }

  /**
   * Unban this member
   * @returns {Promise<void>}
   */
  unban() {
    return this.guild.unbanUser(this.id);
  }
}

module.exports = Member;
