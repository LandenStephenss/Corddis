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

      case constants.GUILD_TEXT: {
        return new TextChannel(data, ...args);
      }

      case constants.GUILD_VOICE: {
        return new VoiceChannel(data, ...args);
      }

      case constants.GUILD_CATEGORY: {
        return new CategoryChannel(data, ...args);
      }
    }

    return new (data.guild_id ? GuildChannel : Channel)(data, ...args);
  }
}

module.exports = Channel;

const CategoryChannel = require('./CategoryChannel');
const GuildChannel = require('./GuildChannel');
const TextChannel = require('./TextChannel');
const VoiceChannel = require('./VoiceChannel');
