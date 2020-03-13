const Base = require('./Base');
const User = require('./User');

/**
 * Class representing an invite
 * @extends {Base}
 */
class Invite extends Base {

  constructor(data, client) {
    super((Date.parse(data.created_at) - 1420070400000) * 4194304);
    this.code = data.code;
    this.guild = client.guilds.get(data.guild_id || data.guild.id) ||
      data.guild;
    this.channel = client.channels.get(data.channel_id || data.channel.id) ||
      data.channel;
    this.inviter = data.inviter ? new User(data.inviter, client) : null;
    this.target = data.target_user ? new User(data.target_user, client) : null;
    this.uses = data.uses === undefined ? null : data.uses;
    this.maxUses = data.max_uses === undefined ? null : data.max_uses;
    this.maxAge = data.max_age === undefined ? null : data.max_age;
    this.temporary = !!data.temporary;

    // You know what would be really nice?
    // this.approximatePresenceCount = data.approximate_presence_count ?? null;
    this.approximatePresenceCount = data.approximate_presence_count == null ?
      null :
      data.approximate_presence_count;
    this.approximateMemberCount = data.approximate_member_count == null ?
      null :
      data.approximate_member_count;
  }

  /**
   * Delete this invite
   * @returns {Promise<void>}
   */
  delete() {
    return this.guild.shard.client.deleteInvite(this.code);
  }
}

module.exports = Invite;
