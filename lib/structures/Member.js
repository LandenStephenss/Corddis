const Base = require('./Base');

/**
 * Class representing a member
 * @extends {Base}
 */
class Member extends Base {

  constructor(data, guild) {
    super(data.user.id);
    this.guild = guild;
    this.user = guild.shard.client.users.add(data.user);
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

  kick() {}

  ban() {}
}

module.exports = Member;
