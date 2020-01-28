const Base = require('./Base');

class Member extends Base {

  constructor(data, guild) {
    super(data.user.id);
    this.guild = guild;
    this.user = guild.shard.client.users.add(data.user);
    this.nick = data.nick;
    this.joinedAt = data.joined_at;
    this.premiumSince = data.premium_since;
    this.hoistRole = data.hoist_role;
    this.deaf = data.deaf;
    this.mute = data.mute;
    this._roles = data.roles;
  }

  get roles() {
    return this._roles.map((role) => this.guild.roles.get(role));
  }

  kick() {}

  ban() {}
}

module.exports = Member;
