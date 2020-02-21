const constants = require('../constants');
const Base = require('./Base');

/**
 * Class representing a channel
 * @extends {Base}
 */
class Channel extends Base {

  constructor(data) {
    super(data.id);
    this.type = data.type;
  }

  static from(data, ...args) {
    switch (data.type) {

      case constants.channelTypes.GUILD_TEXT: {
        return new TextChannel(data, ...args);
      }

      case constants.channelTypes.DM: {
        return new DMChannel(data, ...args);
      }

      case constants.channelTypes.GUILD_VOICE: {
        return new VoiceChannel(data, ...args);
      }

      case constants.channelTypes.GROUP_DM: {
        return new GroupChannel(data, ...args);
      }

      case constants.channelTypes.GUILD_CATEGORY: {
        return new CategoryChannel(data, ...args);
      }

      case constants.channelTypes.GUILD_NEWS: {
        return new NewsChannel(data, ...args);
      }

      case constants.channelTypes.GUILD_STORE: {
        return new StoreChannel(data, ...args);
      }
    }

    return new (data.guild_id ? GuildChannel : Channel)(data, ...args);
  }
}

module.exports = Channel;

const CategoryChannel = require('./CategoryChannel');
const DMChannel = require('./DMChannel');
const GroupChannel = require('./GroupChannel');
const GuildChannel = require('./GuildChannel');
const NewsChannel = require('./NewsChannel');
const StoreChannel = require('./StoreChannel');
const TextChannel = require('./TextChannel');
const VoiceChannel = require('./VoiceChannel');
