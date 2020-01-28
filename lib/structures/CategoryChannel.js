const GuildChannel = require('./GuildChannel');

/**
 * Class representing a category channel
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {

  constructor(data, guild) {
    super(data, guild);
  }

  get children() {
    const filter = (channel) => channel.parentID === this.id;
    return this.guild.channels.filter(filter);
  }
}

module.exports = CategoryChannel;
