const GuildChannel = require('./GuildChannel');

/**
 * Class representing a category channel
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {

  constructor(data, guild) {
    super(data, guild);
  }
}

module.exports = CategoryChannel;
