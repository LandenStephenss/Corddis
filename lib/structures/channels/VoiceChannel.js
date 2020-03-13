const GuildChannel = require('./GuildChannel');
const util = require('../../util').util;

const {
  ChildChannel,
  Invitable
} = require('../../interfaces');

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
    this._update(data);
    this.bitrate = data.bitrate;
    this.userLimit = data.user_limit;

    return super.update(data);
  }
}

util.implement(VoiceChannel, ChildChannel, Invitable);

module.exports = VoiceChannel;
