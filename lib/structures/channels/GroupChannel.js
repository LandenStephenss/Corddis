const Channel = require('./Channel');
const Collection = require('../../Collection');
const MessageCollection = require('../../MessageCollection');
const Textable = require('../../interfaces/Textable');
const User = require('../User');
const util = require('../../util');

/**
 * Class representing a group channel
 * @extends {Channel}
 */
class GroupChannel extends Channel {

  constructor(data, client) {
    super(data);
    this.client = client;
    this.recipients = new Collection(User, data.recipients, client);
    this.messages = new MessageCollection(client.messageLimit);

    this.update(data);
  }

  update(data) {
    this.lastMessageID = data.last_message_id;
    this.lastPinTimestamp = data.last_pin_timestamp;
    this.ownerID = data.owner_id;
  }
}

util.implement(GroupChannel, Textable);

module.exports = GroupChannel;
