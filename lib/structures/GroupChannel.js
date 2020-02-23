const Channel = require('./Channel');
const Collection = require('../Collection');
const Textable = require('../interfaces/Textable');
const User = require('./User');

/**
 * Class representing a group channel
 * @extends {Channel}
 */
class GroupChannel extends Channel {

  constructor(data, client) {
    super(data);
    this.client = client;
    this.recipients = new Collection(User, data.recipients, client);
  }

  update(data) {
    this.lastMessageID = data.last_message_id;
    this.lastPinTimestamp = data.last_pin_timestamp;
    this.ownerID = data.owner_id;
  }
}

Object.assign(GroupChannel.prototype, Textable);

module.exports = GroupChannel;
