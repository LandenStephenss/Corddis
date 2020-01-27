const GuildChannel = require('./GuildChannel');

/**
 * Class representing a voice channel
 * @extends {GuildChannel}
 */
class VoiceChannel extends GuildChannel {

  constructor(data, guild) {
    super(data, guild);
  }
}

module.exports = VoiceChannel;
