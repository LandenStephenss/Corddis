module.exports = {

  /**
   * Bulk delete messages from this channel
   * @arg {string[]} messageIDs Array of message IDs
   * @returns {Promise<void>}
   */
  bulkDeleteMessages(messageIDs) {
    return this.client.rest.bulkDeleteChannelMessages(this.id, messageIDs);
  },

  /**
   * Clear all reactions from a message
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  clearMessageReactions(messageID) {
    return this.client.rest.clearChannelMessageReactions(this.id, messageID);
  },

  /**
   * Create a message to this channel
   * @arg {MessageCreateOptions} options Message create options
   * @returns {Promise<Message>}
   */
  createMessage(options) {
    return this.client.rest.createChannelMessage(this.id, options);
  },

  /**
   * React to a message
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @returns {Promise<void>}
   */
  createMessageReaction(messageID, emoji) {
    return this.client.rest.createChannelMessageReaction(
      this.id,
      messageID,
      emoji
    );
  },

  /**
   * Delete a message from this channel
   * @arg {string} messageID The message's ID
   * @arg {string} [reason] Reason to delete this channel
   * @returns {Promise<void>}
   */
  deleteMessage(messageID, reason) {
    return this.client.rest.deleteChannelMessage(this.id, messageID, reason);
  },

  /**
   * Edit a message from this channel
   * @arg {string} messageID The message's ID
   * @arg {MessageEditOptions} options Message edit options
   * @returns {Promise<Message>}
   */
  editMessage(messageID, options) {
    return this.client.rest.editChannelMessage(this.id, messageID, options);
  },

  /**
   * Get a message from this channel
   * @arg {string} messageID The message's ID
   * @returns {Promise<Message>}
   */
  getMessage(messageID) {
    return this.client.rest.getChannelMessage(this.id, messageID);
  },

  /**
   * Get a message reaction's users
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @arg {ChannelMessagesOptions} [options] Message getting options
   * @returns {Promise<Message[]>}
   */
  getMessageReactionUsers(messageID, emoji, options) {
    return this.client.rest.getChannelMessageReactionUsers(
      this.id,
      messageID,
      emoji,
      options
    );
  },

  /**
   * Get messages from a channel
   * @arg {string} channelID The channel's ID
   * @arg {ChannelMessagesOptions} [options] Message getting options
   * @returns {Promise<Message[]>}
   */
  getMessages(channelID, options) {
    return this.client.rest.getChannelMessages(this.id, channelID, options);
  },

  /**
   * Get this channel's pinned messages
   * @returns {Promise<Message[]>}
   */
  getPinnedMessages() {
    return this.client.rest.getChannelPinnedMessages(this.id);
  },

  /**
   * Pin a message to this channel
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  pinMessage(messageID) {
    return this.client.rest.pinChannelMessage(this.id, messageID);
  },

  /**
   * Delete a user's reaction from a message
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @arg {string} userID The user's ID (or "@me" for the client)
   * @returns {Promise<void>}
   */
  deleteMessageReaction(messageID, emoji, userID) {
    return this.client.rest.deleteChannelMessageReaction(
      this.id,
      messageID,
      emoji,
      userID
    );
  },

  /**
   * Start typing in this channel
   * @returns {Promise<void>}
   */
  startTyping() {
    return this.client.rest.startChannelTyping(this.id);
  },

  /**
   * Unpin a message from this channel
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  unpinMessage(messageID) {
    return this.client.rest.unpinChannelMessage(this.id, messageID);
  },
};
