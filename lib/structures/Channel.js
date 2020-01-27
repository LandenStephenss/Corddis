const Base = require('./Base');

const GUILD_TEXT = 0;
const GUILD_VOICE = 2;
const GUILD_CATEGORY = 4;

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
      case GUILD_TEXT: {
        return new TextChannel(data, ...args);
      }

      case GUILD_VOICE: {
        return new VoiceChannel(data, ...args);
      }

      case GUILD_CATEGORY: {
        return new CategoryChannel(data, ...args);
      }
    }

    return new (data.guild_id ? GuildChannel : Channel)(data, ...args);
  }
}

module.exports = Channel;

const GuildChannel = require('./GuildChannel');
const TextChannel = require('./TextChannel');
const VoiceChannel = require('./VoiceChannel');
const CategoryChannel = require('./CategoryChannel');
