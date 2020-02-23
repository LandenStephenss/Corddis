const Base = require('./Base');

const {
  channelTypes
} = require('../constants');

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
    const map = new Map()
      .set(channelTypes.GUILD_TEXT, TextChannel)
      .set(channelTypes.DM, DMChannel)
      .set(channelTypes.GUILD_VOICE, VoiceChannel)
      .set(channelTypes.GROUP_DM, GroupChannel)
      .set(channelTypes.GUILD_CATEGORY, CategoryChannel)
      .set(channelTypes.GUILD_NEWS, NewsChannel)
      .set(channelTypes.GUILD_STORE, StoreChannel);

    const channelClass = map.get(data.type);

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
