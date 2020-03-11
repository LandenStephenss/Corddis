const Collection = require('./Collection');
const constants = require('../constants');
const Message = require('../structures/Message');

/**
 * Class representing a channel's messages
 * @extends {Collection}
 */
class MessageCollection extends Collection {

  constructor(limit) {
    super(Message);
    this.limit = limit == null ? constants.DEFAULT_MESSAGE_LIMIT : limit;
  }

  add(item, ...args) {
    if (this.size === this.limit) {
      const items = this.values();
      const next = items.next();
      if (next.done) {
        return new this.baseClass(item, ...args);
      }
      this.delete(next.value.id);
    }
    return super.add(item, ...args);
  }
}

module.exports = MessageCollection;
