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
    this.client.rest.clearReactions();
  },

  getMessage() {
    this.client.rest.getMessage();
  },

  getMessages() {
    return this.client.rest.getMessages();
  },

  createMessage() {
    return this.client.rest.createMessage();
  },

  deleteMessage() {
    return this.client.rest.deleteMessage();
  },

  deleteMessages() {
    return this.client.rest.deleteMessages();
  },

  editMessage() {
    return this.client.rest.editMessage();
  },

  pinMessage() {
    return this.client.rest.pinMessage();
  },

  getPinnedMessages() {
    return this.client.rest.getPinnedMessages();
  }
};
