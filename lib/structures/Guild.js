const Base = require('./Base');
const Channel = require('./Channel');
const Collection = require('../Collection');
const Emoji = require('./Emoji');
const GuildChannel = require('./GuildChannel');
const Member = require('./Member');
const Presence = require('./Presence');
const Role = require('./Role');
const VoiceState = require('./VoiceState');

/**
 * Class representing a guild
 * @extends {Base}
 */
class Guild extends Base {
  available = true;

  constructor(data, shard) {
    super(data.id);
    this.shard = shard;

    const channels = new Collection(GuildChannel);
    for (const channelData of data.channels) {
      const channel = channels.add(Channel.from(channelData, this));
      shard.client.channels.add(channel);
    }

    this.roles = new Collection(Role, data.roles, this);
    this.emojis = new Collection(Emoji, data.emojis, this);
    this.members = new Collection(Member, data.members, this);
    this.channels = channels;
    this.voiceStates = new Collection(VoiceState, data.voice_states, this);
    this.presences = new Collection(Presence, data.presences, this);

    this.update(data);
  }

  addMemberRole() {}

  /**
   * Ban a member from this guild
   * @arg {string} memberID The member's ID
   * @arg {BanMemberOptions} [options] Ban member options
   * @returns {Promise<void>}
   */
  banMember(memberID, options) {
    return this.shard.client.rest.banGuildMember(this.id, memberID, options);
  }

  createChannel() {}

  createEmoji() {}
  
  createIntegration() {}

  createRole() {}

  delete() {}

  deleteEmoji() {}

  deleteIntegration() {}

  edit() {}

  editChannelPositions() {}

  editEmbed() {}

  editEmoji() {}

  editIntegration() {}

  editSelfNick() {}

  editRole() {}

  editRolePositions() {}

  getAuditLogs() {}

  getBan() {}

  getBans() {}

  getChannels() {}

  getEmbed() {}

  getEmoji() {}

  getEmojis() {}

  getIntegrations() {}

  /**
   * Get this guild's invites
   * @returns {Promise<Invite[]>}
   */
  getInvites() {
    return this.shard.client.rest.getGuildInvites(this.id);
  }

  getMember() {}

  getMembers() {}

  getPruneCount() {}

  getRoles() {}

  getVanityURL() {}

  getVoiceRegions() {}

  getWidgetImage() {}

  getWebhooks() {}

  /**
   * Kick a member from this guild
   * @arg {string} memberID The member's ID
   * @arg {string} [reason] Reason for the kick
   * @returns {Promise<void>}
   */
  kickMember(memberID, reason) {
    return this.shard.client.rest.kickGuildMember(this.id, memberID, reason);
  }

  leave() {}

  pruneMembers() {}

  removeMemberRole() {}

  /**
   * Request members from this guild
   * @arg {RequestGuildMembersOptions} [options] Request guild members options
   * @returns {Promise<void>}
   */
  requestMembers(options) {
    return this.shard.requestGuildMembers(this.id, options);
  }

  syncIntegration() {}

  /**
   * Unban a user from this guild
   * @arg {string} userID The user's ID
   * @returns {Promise<void>}
   */
  unbanUser(userID) {
    return this.shard.client.rest.unbanGuildUser(this.id, userID);
  }

  update(data) {
    this.name = data.name;
    this.icon = data.icon;
    this.splash = data.splash;
    this.discoverySplash = data.discovery_splash;
    this.ownerID = data.owner_id;
    this.region = data.region;
    this.afkChannelID = data.afk_channel_id;
    this.afkTimeout = data.afk_timeout;
    this.embedEnabled = data.embed_enabled || false;
    this.embedChannelID = data.embed_channel_id || null;
    this.verificationLevel = data.verification_level;
    this.defaultMessageNotifications = data.default_message_notifications;
    this.explicitContentFilter = data.explicit_content_filter;
    this.features = data.features;
    this.mfaLevel = data.mfa_level;
    this.widgetEnabled = data.widget_enabled || false;
    this.widgetChannelID = data.widget_channel_id || null;
    this.systemChannelID = data.system_channel_id || null;
    this.systemChannelFlags = data.system_channel_flags;
    this.rulesChannelID = data.rules_channel_id;
    this.memberCount = data.member_count;
    this.maxPresences = data.max_presences || 5000;
    this.maxMembers = data.max_members || 50000;
    this.vanityURLCode = data.vanity_url_code;
    this.description = data.description;
    this.banner = data.banner;
    this.premiumTier = data.premium_tier;
    this.premiumSubscriptionCount = data.premium_subscription_count;
    this.preferredLocale = data.preferred_locale;
  }
}

module.exports = Guild;
