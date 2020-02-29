const GuildChannel = require('./GuildChannel');

/**
 * Class representing a category channel
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {

  get children() {
    const filter = (channel) => channel._parentID === this.id;
    return this.guild.channels.filter(filter);
  }
}

module.exports = CategoryChannel;
