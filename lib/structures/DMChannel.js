const Channel = require('./Channel');
const Textable = require('../interfaces/Textable');

/**
 * Class representing a DM channel
 * @extends {Channel}
 */
class DMChannel extends Channel {

  constructor(data, client) {
    super(data);
    this.client = client;
    this.recipient = client.users.add(data.recipients[0], client);

    this.update(data);
  }

  update(data) {
    this.lastMessageID = data.last_message_id;
    this.lastPinTimestamp = data.last_pin_timestamp;
  }
}

Object.assign(DMChannel.prototype, Textable);

module.exports = DMChannel;
