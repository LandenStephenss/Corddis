const Channel = require('./Channel');
const MessageCollection = require('../MessageCollection');
const Textable = require('../interfaces/Textable');
const util = require('../util');

/**
 * Class representing a DM channel
 * @extends {Channel}
 */
class DMChannel extends Channel {

  constructor(data, client) {
    super(data);
    this.client = client;
    this.recipient = client.users.add(data.recipients[0], client);
    this.messages = new MessageCollection(client.messageLimit);

    this.update(data);
  }

  update(data) {
    this.lastMessageID = data.last_message_id;
    this.lastPinTimestamp = data.last_pin_timestamp;
  }
}

util.implement(DMChannel, Textable);

module.exports = DMChannel;
