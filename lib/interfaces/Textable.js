module.exports = {

  /**
   * React to a message
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @returns {Promise<void>}
   */
  addMessageReaction(messageID, emoji) {
    return this.client.rest.addMessageReaction(this.id, messageID, emoji);
  },

  /**
   * Remove a user's reaction from a message
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @arg {string} userID The user's ID (or "@me" for the client)
   * @returns {Promise<void>}
   */
  removeMessageReaction(messageID, emoji, userID) {
    const data = [this.id, messageID, emoji, userID];
    return this.client.rest.removeMessageReaction(...data);
  },

  /**
   * Get a message reaction's users
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @arg {ChannelMessagesOptions} [options] Message getting options
   * @returns {Promise<Message[]>}
   */
  getMessageReactionUsers(messageID, emoji, options) {
    const data = [this.channel.id, messageID, emoji, options];
    return this.client.rest.getMessageReactionUsers(...data);
  },

  /**
   * Clear all reactions from a message
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  clearMessageReactions(messageID) {
    return this.client.rest.clearMessageReactions(this.channel.id, messageID);
  },

  /**
   * Get a message from this channel
   * @arg {string} messageID The message's ID
   * @returns {Promise<Message>}
   */
  getMessage(messageID) {
    return this.client.rest.getMessage(this.channel.id, messageID);
  },

  /**
   * Get messages from a channel
   * @arg {string} channelID The channel's ID
   * @arg {ChannelMessagesOptions} options Message getting options
   * @returns {Promise<Message[]>}
   */
  getMessages(channelID, options) {
    return this.client.rest.getMessages(this.channel.id, channelID, options);
  },

  /**
   * Create a message to this channel
   * @arg {MessageCreateOptions} options Message create options
   * @returns {Promise<Message>}
   */
  createMessage(options) {
    return this.client.rest.createMessage(this.channel.id, options);
  },

  /**
   * Delete a message from this channel
   * @arg {string} messageID The message's ID
   * @arg {string} [reason] Reason to delete this channel
   * @returns {Promise<void>}
   */
  deleteMessage(messageID, reason) {
    return this.client.rest.deleteMessage(this.channel.id, messageID, reason);
  },

  /**
   * Bulk delete messages from this channel
   * @arg {string[]} messageIDs Array of message IDs
   * @returns {Promise<void>}
   */
  deleteMessages(messageIDs) {
    return this.client.rest.deleteMessages(this.channel.id, messageIDs);
  },

  /**
   * Edit a message from this channel
   * @arg {string} messageID The message's ID
   * @arg {MessageEditOptions} options Message edit options
   * @returns {Promise<Message>}
   */
  editMessage(messageID, options) {
    return this.client.rest.editMessage(this.channel.id, messageID, options);
  },

  /**
   * Pin a message to this channel
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  pinMessage(messageID) {
    return this.client.rest.pinMessage(this.channel.id, messageID);
  },

  /**
   * Unpin a message from this channel
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  unpinMessage(messageID) {
    return this.client.rest.unpinMessage(this.channel.id, messageID);
  },

  /**
   * Get this channel's pinned messages
   * @returns {Promise<Message[]>}
   */
  getPinnedMessages() {
    return this.client.rest.getPinnedMessages(this.channel.id);
  }
};
