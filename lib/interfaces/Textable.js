module.exports = {
  addReaction() {
    return this.client.rest.addReaction();
  },

  deleteReaction() {
    return this.client.rest.deleteReaction();
  },

  getReactions() {
    return this.client.rest.getReactions();
  },

  clearReactions() {
    return this.client.rest.clearReactions();
  },

  getMessage() {
    return this.client.rest.getMessage();
  },

  getMessages() {
    return this.client.rest.getMessages();
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

  deleteMessages() {
    return this.client.rest.deleteMessages();
  },

  editMessage() {
    return this.client.rest.editMessage();
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
  upinMessage(messageID) {
    return this.client.rest.upinMessage(this.channel.id, messageID);
  },

  getPinnedMessages() {
    return this.client.rest.getPinnedMessages();
  }
};
