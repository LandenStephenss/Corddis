module.exports = {

  /**
   * Get the invites from this channel
   * @returns {Promise<Invite[]>}
   */
  getInvites() {
    return this.client.rest.getChannelInvites(this.id);
  },

  /**
   * Create an invite for this channel
   * @returns {Promise<Invite>}
   */
  createInvite() {
    return this.client.rest.createChannelInvite(this.id);
  }
};
