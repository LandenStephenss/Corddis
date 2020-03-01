const Collection = require('./Collection');
const constants = require('./constants');
const Message = require('./structures/Message');

/**
 * Class representing a channel's messages
 * @extends {Collection}
 */
class MessageCollection extends Collection {

  constructor(limit) {
    super(Message);
    this.limit = limit || constants.DEFAULT_MESSAGE_LIMIT;
  }

  add(item, ...args) {
    if (this.size === this.limit) {
      const items = this.values();
      this.delete(items.next().value.id);
    }
    return super.add(item, ...args);
  }
}

module.exports = MessageCollection;
