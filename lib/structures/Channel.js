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
    const channelClassList = [
      TextChannel,
      DMChannel,
      VoiceChannel,
      GroupChannel,
      CategoryChannel,
      NewsChannel,
      StoreChannel
    ];

    const channelClass = channelClassList[data.type];

    return new (
      channelClass ||
      (data.guild_id ? GuildChannel : Channel)
    )(data, ...args);
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
