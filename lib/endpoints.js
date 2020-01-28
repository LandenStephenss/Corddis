const CHANNEL = (a) => `channels/${a}`;
const CHANNEL_MESSAGE = (a, b) => `${CHANNEL_MESSAGES(a)}/${b}`;
const CHANNEL_MESSAGES = (a) => `${CHANNEL(a)}/messages`;
const CHANNEL_PINS = (a) => `${CHANNEL(a)}/pins`;
const MESSAGE_REACTION = (a, b, c) =>`${MESSAGE_REACTIONS(a, b)}/${c}`;
const MESSAGE_REACTIONS = (a, b) => `${CHANNEL_MESSAGE(a, b)}/reactions`;

module.exports = {
  CHANNEL,
  CHANNEL_MESSAGE,
  CHANNEL_MESSAGES,
  CHANNEL_PIN: (a, b) => `${CHANNEL_PINS(a)}/${b}`,
  CHANNEL_PINS,
  GATEWAY: 'gateway',
  GATEWAY_BOT: 'gateway/bot',
  MESSAGE_REACTION,
  MESSAGE_REACTIONS,
  USER_REACTION: (a, b, c, d) => `${MESSAGE_REACTION(a, b, c)}/${d}`
};
