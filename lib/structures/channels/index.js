const Channel = require('./Channel');

module.exports = {
  CategoryChannel: require('./CategoryChannel'),
  Channel,
  DMChannel: require('./DMChannel'),
  GroupChannel: require('./GroupChannel'),
  GuildChannel: require('./GuildChannel'),
  NewsChannel: require('./NewsChannel'),
  StoreChannel: require('./StoreChannel'),
  TextChannel: require('./TextChannel'),
  VoiceChannel: require('./VoiceChannel')
};
