const Base = require('./Base');

/**
 * Class representing an invite
 * @extends {Base}
 */
class Invite extends Base {

  constructor(data, client) {
    super(Date.parse(data.created_at) - 1420070400000) * 4194304);
    this.code = data.code;
    this.guild = client.guilds.get(data.guild.id) || data.guild;
    this.channel = client.channels.get(data.channel.id) || data.channel;
    this.uses = data.uses;
    this.maxUses = data.max_uses;
    this.maxAge = data.max_age;
    this.temporary = data.temporary;
  }
}

module.exports = Invite;
