/* eslint-disable max-len, no-multi-spaces */

const channel =                                   (channelID) => `channels/${channelID}`;
const channelMessage =                 (channelID, messageID) => `${channelMessages(channelID)}/${messageID}`;
const channelMessages =                           (channelID) => `${channel(channelID)}/messages`;
const channelPins =                               (channelID) => `${channel(channelID)}/pins`;
const guild =                                       (guildID) => `guilds/${guildID}`;
const guildBans =                                   (guildID) => `${guild(guildID)}/bans`;
const guildEmojis =                                 (guildID) => `${guild(guildID)}/emojis`;
const guildIntegrations =                           (guildID) => `${guild(guildID)}/integrations`;
const guildMember =                         (guildID, userID) => `${guildMembers(guildID)}/${userID}`;
const guildMembers =                                (guildID) => `${guild(guildID)}/members`;
const guildRoles =                                  (guildID) => `${guild(guildID)}/roles`;
const meGuilds =                                                 'users/@me/guilds';
const channelMessageReaction =  (channelID, messageID, emoji) => `${channelMessageReactions(channelID, messageID)}/${emoji}`;
const channelMessageReactions =        (channelID, messageID) => `${channelMessage(channelID, messageID)}/reactions`;
const webhook =                                   (webhookID) => `webhooks/${webhookID}`;
const webhookToken =                     (webhookID, whToken) => `${webhook(webhookID)}/${whToken}`;

module.exports = {
  channel,
  channelBulkDelete:                                       (channelID) => `${channelMessages(channelID)}/bulk-delete`,
  channelInvites:                                          (channelID) => `${channel(channelID)}/invites`,
  channelMessage,
  channelMessageReaction,
  channelMessageReactions,
  channelMessages,
  channelPin:                                   (channelID, messageID) => `${channelPins(channelID)}/${messageID}`,
  channelPins,
  channelTyping:                                           (channelID) => `${channel(channelID)}/typing`,
  channelWebhooks:                                         (channelID) => `${channel(channelID)}/webhooks`,
  gateway:                                                                'gateway',
  gatewayBot:                                                             'gateway/bot',
  guildAuditLogs:                                            (guildID) => `${guild(guildID)}/audit-logs`,
  guildBan:                                          (guildID, userID) => `${guildBans(guildID)}/${userID}`,
  guildBans,
  guildChannels:                                             (guildID) => `${guild(guildID)}/channels`,
  guildEmbed:                                                (guildID) => `${guild(guildID)}/embed`,
  guildEmoji:                                       (guildID, emojiID) => `${guildEmojis(guildID)}/${emojiID}`,
  guildEmojis,
  guildIntegration:                           (guildID, integrationID) => `${guildIntegrations(guildID)}/${integrationID}`,
  guildIntegrations,
  guildIntegrationsSync:                                     (guildID) => `${guildIntegrations(guildID)}/sync`,
  guildInvites:                                              (guildID) => `${guild(guildID)}/invites`,
  guildMember,
  guildMemberMeNick:                                         (guildID) => `${guildMember(guildID, '@me')}/nick`,
  guildMemberRole:                           (guildID, userID, roleID) => `${guildMember(guildID, userID)}/roles/${roleID}`,
  guildMembers,
  guildPrune:                                                (guildID) => `${guild(guildID)}/prune`,
  guildRegions:                                              (guildID) => `${guild(guildID)}/regions`,
  guildRole:                                         (guildID, roleID) => `${guildRoles(guildID)}/${roleID}`,
  guildRoles,
  guildVanityURL:                                            (guildID) => `${guild(guildID)}/vanity-url`,
  guildWebhooks:                                             (guildID) => `${guild(guildID)}/webhooks`,
  invite:                                                 (inviteCode) => `invites/${inviteCode}`,
  meGuild:                                                   (guildID) => `${meGuilds}/${guildID}`,
  meGuilds,
  channelMessageReactionUser:      (channelID, messageID, emoji, user) => `${channelMessageReaction(channelID, messageID, emoji)}/${user}`,
  channelPermission:                          (channelID, overwriteID) => `${channel(channelID)}/permissions/${overwriteID}`,
  user:                                                       (userID) => `users/${userID}`,
  users:                                                                  'users',
  voiceRegions:                                                           'voice/regions',
  webhook,
  webhookSlack:                                            (webhookID) => `${webhook(webhookID)}/slack`,
  webhookToken,
  webhookTokenSlack:                              (webhookID, whToken) => `${webhookToken(webhookID, whToken)}/slack`,

  // CDN
  achievementIcon:            (applicationID, achievementID, iconHash) => `app-assets/${applicationID}/achievements/${achievementID}/icons/${iconHash}`,
  applicationIcon:                               (applicationID, icon) => `app-icons/${applicationID}/${icon}`,
  applicationAsset:                           (applicationID, assetID) => `app-assets/${applicationID}/${assetID}`,
  channelIcon:                                (channelID, channelIcon) => `channel-icons/${channelID}/${channelIcon}`,
  customEmoji:                                               (emojiID) => `emojis/${emojiID}`,
  defaultUserAvatar:                               (userDiscriminator) => `embed/avatars/${userDiscriminator}`,
  guildBanner:                                  (guildID, guildBanner) => `banners/${guildID}/${guildBanner}`,
  guildDiscoverySplash:                (guildID, guildDiscoverySplash) => `discovery-splashes/${guildID}/${guildDiscoverySplash}`,
  guildIcon:                                      (guildID, guildIcon) => `icons/${guildID}/${guildIcon}`,
  guildSplash:                                  (guildID, guildSplash) => `splashes/${guildID}/${guildSplash}`,
  teamIcon:                                         (teamID, teamIcon) => `team-icons/${teamID}/${teamIcon}`,
  userAvatar:                                     (userID, userAvatar) => `avatars/${userID}/${userAvatar}`
};
