const TextChannel = require('./TextChannel');
const {
  Invitable,
  Textable
} = require('../interfaces/');

/**
 * Class representing a news channel
 * @extends {NewsChannel}
 */
class NewsChannel extends TextChannel {
}

Object.assign(NewsChannel, Invitable, Textable);

module.exports = NewsChannel;
