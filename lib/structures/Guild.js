/**
 * Class representing a guild
 */
class Guild {

  constructor(data, shard) {
    this.id = data.id;
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
    this.roles = data.roles;
    this.emojis = data.emojis;
    this.features = data.features;
    this.mfaLevel = data.mfa_level;
    this.widgetEnabled = data.widget_enabled || false;
    this.widgetChannelID = data.widget_channel_id || null;
    this.systemChannelID = data.system_channel_id || null;
    this.systemChannelFlags = data.system_channel_flags;
    this.rulesChannelID = data.rules_channel_id;
    this.available = true;
    this.memberCount = data.member_count;
    this.voiceStates = data.voice_states;
    this.members = data.members;
    this.channels = data.channels;
    this.presences = data.presences;
    this.maxPresences = data.max_presences || 5000;
    this.maxMembers = data.max_members || 50000;
    this.vanityURLCode = data.vanity_url_code;
    this.description = data.description;
    this.banner = data.banner;
    this.premiumTier = data.premium_tier;
    this.premiumSubscriptionCount = data.premium_subscription_count;
    this.preferredLocale = data.preferred_locale;
    this.shard = shard;
  }

  get embedChannel() {
    return this.embedChannelID && this.channels.get(this.embedChannelID);
  }

  get widgetChannel() {
    return this.widgetChannelID && this.channels.get(this.widgetChannelID);
  }

  get systemChannel() {
    return this.systemChannelID && this.channels.get(this.systemChannelID);
  }

  get rulesChannel() {
    return this.rulesChannelID && this.channels.get(this.rulesChannelID);
  }
}

module.exports = Guild;
