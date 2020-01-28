const Channel = require('./Channel');
const Textable = require('../interfaces/Textable');

/**
 * Class representing a DM channel
 * @extends {Channel}
 */
class DMChannel extends Channel {

  constructor(data, client) {
    super(data);
    this.recipient = client.users.add(data.recipients[0]);
    this.lastMessageID = data.last_message_id;
    this.lastPinTimestamp = data.last_pin_timestamp;
  }
}

Object.assign(DMChannel.prototype, Textable);

module.exports = DMChannel;
