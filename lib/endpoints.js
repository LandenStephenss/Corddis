const CHANNEL = (a) => `channels/${a}`;
const CHANNEL_MESSAGES = (a) => `${CHANNEL(a)}/messages`;

module.exports = {
  CHANNEL,
  CHANNEL_MESSAGE: (a, b) => `${CHANNEL_MESSAGES(a)}/${b}`,
  CHANNEL_MESSAGES,
  GATEWAY: 'gateway',
  GATEWAY_BOT: 'gateway/bot'
};
