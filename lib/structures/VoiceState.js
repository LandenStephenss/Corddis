const Base = require('./Base');

/**
 * Class representing a voice state
 * @extends {Base}
 */
class VoiceState extends Base {

  constructor(data, guild) {
    super(data.user_id);
    this.member = guild.members.get(data.user_id);
    this.channel = guild.channels.get(data.channel_id) || {
      id: data.channel_id
    };
    this.sessionID = data.session_id;
    this.deaf = data.deaf;
    this.selfDeaf = data.self_deaf;
    this.mute = data.mute;
    this.selfMute = data.self_mute;
    this.selfStream = !!data.self_stream;
    this.suppress = data.suppress;
  }
}

module.exports = VoiceState;
