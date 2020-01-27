const GuildChannel = require('./GuildChannel');
const Textable = require('../interfaces/Textable');

/**
 * Class representing a text channel
 * @extends {GuildChannel}
 */
class TextChannel extends GuildChannel {

  constructor(data, guild) {
    super(data, guild);
  }
}

Object.assign(TextChannel.prototype, Textable);

module.exports = TextChannel;
