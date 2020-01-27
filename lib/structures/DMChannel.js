const Channel = require('./Channel');

/**
 * Class representing a DM channel
 * @extends {Channel}
 */
class DMChannel extends Channel {

  constructor(data, client) {
    super(data);
    this.recipient = client.channels.add(data.recipients[0]);
    this.lastMessageID = data.last_message_id;
    this.lastPinTimestamp = data.last_pin_timestamp;
  }
}

module.exports = DMChannel;
