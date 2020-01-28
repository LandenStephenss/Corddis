const Base = require('./Base');

/**
 * Class representing a message
 * @extends {Base}
 */
class Message extends Base {

  constructor(data, client) {
    super(data.id);
    this.client = client;
    this.channel = client.channels.get(data.channel_id) || {
      id: data.channel_id
    };
    this.guild = data.guild_id ? client.guilds.get(data.guild_id) || {
      id: data.guild_id
    } : null;
    this.author = client.users.add(data.author);
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

  /**
   * Edit this message
   * @arg {MessageEditOptions} options Message edit options
   * @returns {Promise<Message>}
   */
  edit(options) {
    return this.client.rest.editMessage(this.channel.id, this.id, options);
  }

  /**
   * Delete this message
   * @arg {string} [reason] Reason to delete this message
   * @returns {Promise<void>}
   */
  delete(reason) {
    return this.client.rest.deleteMessage(this.channel.id, this.id, reason);
  }

  /**
   * Pin this message
   * @returns {Promise<void>}
   */
  pin() {
    return this.client.rest.pinMessage(this.channel.id, this.id);
  }

  /**
   * React to this message
   * @arg {string} emoji The enocded emoji
   * @returns {Promise<void>}
   */
  react(emoji) {
    return this.client.rest.addMessageReaction(this.channel.id, this.id, emoji);
  }

  /**
   * Make someone unreact from this message
   * @arg {string} emoji The encoded emoji
   * @arg {string} userID The user's ID (or "@me" for the client)
   * @returns {Promise<void>}
   */
  unreact(emoji, userID) {
    const data = [this.channel.id, this.id, emoji, userID];
    return this.client.rest.removeMessageReaction(...data);
  }
}

module.exports = Message;
