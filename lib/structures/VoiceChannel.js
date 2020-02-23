const GuildChannel = require('./GuildChannel');
const Invitable = require('../interfaces/Invitable');

/**
 * Class representing a voice channel
 * @extends {GuildChannel}
 */
class VoiceChannel extends GuildChannel {

  constructor(data, guild) {
    super(data, guild);

    this.update(data);
  }

  get users() {
    const filter = (voiceState) => voiceState.channelID === this.id;
    return this.guild.voiceStates.filter(filter);
  }

  update(data) {
    super.update(data);
    this.bitrate = data.bitrate;
    this.userLimit = data.user_limit;
  }
}

Object.assign(VoiceChannel.prototype, Invitable);

module.exports = VoiceChannel;
