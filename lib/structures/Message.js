/**
 * Class representing a message
 */
class Message {

  constructor(data, client) {
    this.client = client;
    this.id = data.id;
    this.channelID = data.channel_id;
    this.guildID = data.guild_id;
    this.author = data.author;
    this.member = data.member;
    this.content = data.content;
    this.editedTimestamp = data.edited_timestamp || null;
    this.tts = data.tts;
    this.mentions = data.mentions;
    this.mentionEveryone = data.mention_everyone;
    this.mentionRoles = data.mention_roles;
    this.mentionChannels = data.mention_channels || [];
    this.attachments = data.attachments;
    this.embeds = data.embeds;
    this.reactions = data.reactions || [];
    this.nonce = data.nonce;
    this.pinned = data.pinned;
    this.type = data.type;
    this.messageReference = data.message_reference || null;
    this.flags = data.flags;
  }

  get channel() {
    return this.client.channels.get(this.channelID) || {
      id: this.channelID
    };
  }

  get guild() {
    return this.guildID ? this.client.guilds.get(this.guildID) || {
      id: this.guildID
    } : null;
  }

  /**
   * Edit this message
   * @arg {MessageOptions} options Message edit options
   * @returns {Promise<Message>}
   */
  edit(options) {
    return this.client.rest.editMessage(this.channelID, this.id, options);
  }

  /**
   * Delete this message
   * @arg {string} [reason] Reason to delete this message
   * @returns {Promise<void>}
   */
  delete(reason) {
    return this.client.rest.deleteMessage(this.channelID, this.id, reason);
  }
}

module.exports = Message;
