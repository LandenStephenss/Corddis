/* eslint-disable max-len, no-multi-spaces */

const channel =                             (channelID) => `channels/${channelID}`;
const channelMessage =           (channelID, messageID) => `${channelMessages(channelID)}/${messageID}`;
const channelMessages =                     (channelID) => `${channel(channelID)}/messages`;
const channelPins =                         (channelID) => `${channel(channelID)}/pins`;
const guild =                                 (guildID) => `guilds/${guildID}`;
const guildBans =                             (guildID) => `${guild(guildID)}/bans`;
const guildEmojis =                           (guildID) => `${guild(guildID)}/emojis`;
const guildIntegrations =                     (guildID) => `${guild(guildID)}/integrations`;
const guildMember =                   (guildID, userID) => `${guildMembers(guildID)}/${userID}`;
const guildMembers =                          (guildID) => `${guild(guildID)}/members`;
const guildRoles =                            (guildID) => `${guild(guildID)}/roles`;
const meGuilds =                                           'users/@me/guilds';
const messageReaction =   (channelID, messageID, emoji) => `${messageReactions(channelID, messageID)}/${emoji}`;
const messageReactions =         (channelID, messageID) => `${channelMessage(channelID, messageID)}/reactions`;
const webhook =                             (webhookID) => `webhooks/${webhookID}`;

module.exports = {
  channel,
  channelbulkDelete:                             (channelID) => `${channelMessages(channelID)}/bulk-delete`,
  channelInvites:                                (channelID) => `${channel(channelID)}/invites`,
  channelMessage,
  channelMessages,
  channelPin:                         (channelID, messageID) => `${channelPins(channelID)}/${messageID}`,
  channelPins,
  channelTyping:                                 (channelID) => `${channel(channelID)}/typing`,
  channelWebhooks:                               (channelID) => `${channel(channelID)}/webhooks`,
  gateway:                                                      'gateway',
  gatewayBot:                                                   'gateway/bot',
  guildAuditLogs:                                  (guildID) => `${guild(guildID)}/audit-logs`,
  guildBan:                                (guildID, userID) => `${guildBans(guildID)}/${userID}`,
  guildBans,
  guildChannels:                                   (guildID) => `${guild(guildID)}/channels`,
  guildEmbed:                                      (guildID) => `${guild(guildID)}/embed`,
  guildEmoji:                             (guildID, emojiID) => `${guildEmojis(guildID)}/${emojiID}`,
  guildEmojis,
  guildIntegration:                 (guildID, integrationID) => `${guildIntegrations(guildID)}/${integrationID}`,
  guildIntegrations,
  guildIntegrationsSync:                           (guildID) => `${guildIntegrations(guildID)}/sync`,
  guildInvites:                                    (guildID) => `${guild(guildID)}/invites`,
  guildMember,
  guildMemberMeNick:                               (guildID) => `${guildMember(guildID, '@me')}/nick`,
  guildMembers,
  guildPrune:                                      (guildID) => `${guild(guildID)}/prune`,
  guildRegions:                                    (guildID) => `${guild(guildID)}/regions`,
  guildRole:                               (guildID, roleID) => `${guildRoles(guildID)}/${roleID}`,
  guildRoles,
  guildVanityURL:                                  (guildID) => `${guild(guildID)}/vanity-url`,
  guildWebhooks:                                   (guildID) => `${guild(guildID)}/webhooks`,
  invite:                                       (inviteCode) => `/invites/${inviteCode}`,
  meGuild:                                         (guildID) => `${meGuilds}/${guildID}`,
  meGuilds,
  memberRole:                      (guildID, userID, roleID) => `${guildMember(guildID, userID)}/roles/${roleID}`,
  messageReaction,
  messageReactions,
  permission:                       (channelID, overwriteID) => `${channel(channelID)}/permissions/${overwriteID}`,
  tokenWebhook:                    (webhookID, webhookToken) => `${webhook(webhookID)}/${webhookToken}`,
  user:                                             (userID) => `users/${userID}`,
  userReaction:          (channelID, messageID, emoji, user) => `${messageReaction(channelID, messageID, emoji)}/${user}`,
  webhook
};
