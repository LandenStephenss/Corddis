const Channel = require('./Channel');
const Textable = require('../interfaces/Textable');

/**
 * Class representing a group channel
 * @extends {Channel}
 */
class GroupChannel extends Channel {

  constructor(data, client) {
    super(data);
    this.client = client;

    const recipientMap = (recipient) => client.users.add(recipient, client);
    this.recipients = data.recipients.map(recipientMap);

    this.lastMessageID = data.last_message_id;
    this.lastPinTimestamp = data.last_pin_timestamp;
    this.ownerID = data.owner_id;
  }
}

Object.assign(GroupChannel.prototype, Textable);

module.exports = GroupChannel;
