const Base = require('./Base');
const User = require('./User');

/**
 * Class representing a message
 * @extends {Base}
 */
class Message extends Base {

  constructor(data, client) {
    super(data.id);
    this.channel = client.channels.get(data.channel_id) || {
      id: data.channel_id
    };

    this.author = data.webhook_id ?
      new User(data.author, client) :
      client.users.add(data.author, client);

    if (data.guild_id) {
      const guild = this.guild = client.guilds.get(data.guild_id);
      if (!data.webhook_id) {
        data.member.user = data.author;
        this.member = guild.members.add(data.member, guild);
      }
    }

    this.update(data);
  }

  /**
   * Delete this message
   * @arg {string} [reason] Reason to delete this message
   * @returns {Promise<void>}
   */
  delete(reason) {
    return this.channel.deleteMessage(this.id, reason);
  }

  /**
   * Edit this message
   * @arg {MessageEditOptions} options Message edit options
   * @returns {Promise<Message>}
   */
  edit(options) {
    return this.channel.editMessage(this.id, options);
  }

  /**
   * Pin this message
   * @returns {Promise<void>}
   */
  pin() {
    return this.channel.pinMessage(this.id);
  }

  /**
   * React to this message
   * @arg {string} emoji The enocded emoji
   * @returns {Promise<void>}
   */
  react(emoji) {
    return this.channel.addMessageReaction(this.id, emoji);
  }

  /**
   * Unpin this message
   * @returns {Promise<void>}
   */
  unpin() {
    return this.channel.unpinMessage(this.id);
  }

  /**
   * Make someone unreact from this message
   * @arg {string} emoji The encoded emoji
   * @arg {string} userID The user's ID (or "@me" for the client)
   * @returns {Promise<void>}
   */
  unreact(emoji, userID) {
    return this.channel.removeMessageReaction(this.id, emoji, userID);
  }

  update(data) {
    this.client = data.content;
    this.content = data.content;
    this.editedTimestamp = data.edited_timestamp;
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
}

module.exports = Message;
