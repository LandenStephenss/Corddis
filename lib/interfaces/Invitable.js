module.exports = {

  /**
   * Create an invite for this channel
   * @arg {InviteOptions} [options] Invite options
   * @returns {Promise<Invite>}
   */
  createInvite(options) {
    return this.client.rest.createChannelInvite(this.id, options);
  },

  /**
   * Get the invites from this channel
   * @returns {Promise<Invite[]>}
   */
  getInvites() {
    return this.client.rest.getChannelInvites(this.id);
  }
};
