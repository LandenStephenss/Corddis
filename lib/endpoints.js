const CHANNEL = (a) => `channels/${a}`;
const CHANNEL_MESSAGE = (a, b) => `${CHANNEL_MESSAGES(a)}/${b}`;
const CHANNEL_MESSAGES = (a) => `${CHANNEL(a)}/messages`;
const CHANNEL_PINS = (a) => `${CHANNEL(a)}/pins`;
const GUILD = (a) => `guilds/${a}`;
const GUILD_BANS = (a) => `${GUILD(a)}/bans`;
const MESSAGE_REACTION = (a, b, c) =>`${MESSAGE_REACTIONS(a, b)}/${c}`;
const MESSAGE_REACTIONS = (a, b) => `${CHANNEL_MESSAGE(a, b)}/reactions`;

module.exports = {
  CHANNEL,
  CHANNEL_BULK_DELETE: (a) => `${CHANNEL_MESSAGES(a)}/bulk-delete`,
  CHANNEL_INVITES: (a) => `${CHANNEL(a)}/invites`,
  CHANNEL_MESSAGE,
  CHANNEL_MESSAGES,
  CHANNEL_PIN: (a, b) => `${CHANNEL_PINS(a)}/${b}`,
  CHANNEL_PINS,
  GATEWAY: 'gateway',
  GATEWAY_BOT: 'gateway/bot',
  GUILD,
  GUILD_BAN: (a, b) => `${GUILD_BANS(a)}/${b}`,
  GUILD_BANS,
  GUILD_INVITES: (a) => `${GUILD(a)}/invites`,
  GUILD_MEMBER: (a, b) => `${GUILD(a)}/members/${b}`,
  INVITE: (a) => `invites/${a}`,
  MESSAGE_REACTION,
  MESSAGE_REACTIONS,
  USER_REACTION: (a, b, c, d) => `${MESSAGE_REACTION(a, b, c)}/${d}`
};
