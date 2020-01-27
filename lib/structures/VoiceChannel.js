const GuildChannel = require('./GuildChannel');

/**
 * Class representing a voice channel
 * @extends {GuildChannel}
 */
class VoiceChannel extends GuildChannel {

  constructor(data, guild) {
    super(data, guild);
    this.bitrate = data.bitrate;
    this.userLimit = data.user_limit;
  }
}

module.exports = VoiceChannel;
