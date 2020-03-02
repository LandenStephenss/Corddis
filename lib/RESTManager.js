const endpoints = require('./endpoints');
const https = require('https');
const logger = require('./logger');
const pkg = require('../package');

const {
  REST_VERSION
} = require('./constants').versions;

const {
  Invite,
  Message,
  User
} = require('./structures');

/**
 * Class representing a REST manager
 */
class RESTManager {

  /**
   * @arg {Client} client Client to initialize this REST manager
   * @arg {RESTManagerOptions} [options] REST manager options
   */
  constructor(client, options = {}) {
    this.client = client;
    this.version = options.version || REST_VERSION;
  }

  request(options) {
    let path = `/api/v${this.version}/${options.endpoint}`;
    if (options.query) {
      path += query(options.query);
    }

    const headers = {
      Authorization: options.auth ? this.client.token : null,
      'User-Agent': `DiscordBot (${pkg.homepage}, ${pkg.version})`,
      'X-Audit-Log-Reason': options.reason || null
    };

    let data = '';
    if (options.files) {
      headers['Content-Type'] = 'multipart/form-data; boundary=----corddis';
      for (const file of options.files) {
        data += `------corddis\n${addFormField(file, 'octet-stream', true)}\n`;
      }

      if (options.body) {
        const form = {
          name: 'payload_json',
          data: JSON.stringify(options.body)
        };
        data += `------corddis\n${addFormField(form, 'json')}\n`;
      }

      data += '------corddis--';
    }
    else if (options.body) {
      headers['Content-Type'] = 'application/json';
      data = JSON.stringify(options.body);
    }

    logger.debug(
      `Making a ${options.method} request to https://discordapp.com${path}`
    );

    const req = https.request({
      headers,
      host: 'discordapp.com',
      method: options.method,
      path
    });

    if (data) {
      req.write(Buffer.from(data));
      data = '';
    }

    req.end();

    return new Promise((resolve, reject) => {
      req.on('response', (response) => {
        response.on('data', (chunk) => data += chunk);
        response.on('end', () => {
          if (response.statusCode < 400) {
            resolve(data ? JSON.parse(data) : null);
            return;
          }

          data = JSON.parse(data);
          const error = new Error(data.message);
          error.code = data.code;
          error.statusCode = response.statusCode;
          reject(error);
        });
      });
    });
  }

  addGuildMemberRole() {}

  /**
   * Ban a member from a guild
   * @arg {string} guildID The guild's ID
   * @arg {string} memberID The member's ID
   * @arg {BanMemberOptions} [options] Ban member options
   * @returns {Promise<void>}
   */
  banGuildMember(guildID, memberID, options = {}) {
    return this.request({
      auth: true,
      endpoint: endpoints.guildBan(guildID, memberID),
      method: 'PUT',
      query: options
    });
  }

  /**
   * Delete messages from a channel
   * @arg {string} channelID The channel's ID
   * @arg {string[]} messageIDs Array of message IDs
   * @returns {Promise<void>}
   */
  bulkDeleteChannelMessages(channelID, messageIDs) {
    const body = {
      messages: messageIDs
    };

    return this.request({
      auth: true,
      body,
      endpoint: endpoints.channelBulkDelete(channelID),
      method: 'POST'
    });
  }

  /**
   * Clear all reactions from a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  clearMessageReactions(channelID, messageID) {
    return this.request({
      auth: true,
      endpoint: endpoints.messageReactions(channelID, messageID),
      method: 'DELETE'
    });
  }

  /**
   * Create an invite for a channel
   * @arg {string} channelID The channel's ID
   * @arg {InviteOptions} [options] Invite options
   * @returns {Promise<Invite>}
   */
  async createChannelInvite(channelID, options = {}) {
    const body = {
      ...options,
      max_age: options.maxAge,
      max_uses: options.maxUses
    };

    const data = await this.request({
      auth: true,
      body,
      endpoint: endpoints.channelInvites(channelID),
      method: 'POST'
    });

    return new Invite(data, this.client);
  }

  /**
   * Send a message to a channel
   * @arg {string} channelID The channel to send the message to
   * @arg {ChannelMessageCreateOptions} options Message create options
   * @returns {Promise<Message>}
   */
  async createChannelMessage(channelID, options) {
    const body = typeof options === 'string' ? {
      content: options
    } : {
      content: options.content,
      embed: options.embed,
      nonce: options.nonce,
      tts: options.tts
    };

    const data = await this.request({
      auth: true,
      body,
      endpoint: endpoints.channelMessages(channelID),
      files: options.files,
      method: 'POST'
    });

    return new Message(data, this.client);
  }

  /**
   * React to a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @returns {Promise<void>}
   */
  createChannelMessageReaction(channelID, messageID, emoji) {
    emoji = encodeURIComponent(emoji);

    return this.request({
      auth: true,
      endpoint: endpoints.userReaction(channelID, messageID, emoji, '@me'),
      method: 'PUT'
    });
  }

  createGuildChannel() {}

  createGuildEmoji() {}

  createGuildIntegration() {}

  createGuildRole() {}

  deleteChannel() {}

  /**
   * Delete a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {string} [reason] Reason to delete the message
   * @returns {Promise<void>}
   */
  deleteChannelMessage(channelID, messageID, reason) {
    return this.request({
      auth: true,
      endpoint: endpoints.channelMessage(channelID, messageID),
      method: 'DELETE',
      reason
    });
  }

  /**
   * Delete a user's reaction from a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @arg {string} [userID] The user's ID (or "@me" for the client)
   * @returns {Promise<void>}
   */
  deleteChannelMessageReaction(channelID, messageID, emoji, userID = '@me') {
    emoji = encodeURIComponent(emoji);

    return this.request({
      auth: true,
      endpoint: endpoints.userReaction(channelID, messageID, emoji, userID),
      method: 'DELETE'
    });
  }

  /**
   * Delete an invite
   * @arg {string} inviteCode The invite's code
   * @returns {Promise<void>}
   */
  deleteInvite(inviteCode) {
    return this.request({
      auth: true,
      endpoint: endpoints.invite(inviteCode),
      method: 'DELETE'
    });
  }

  deleteChannelPermission() {}

  deleteGuild() {}

  deleteGuildEmoji() {}

  deleteGuildIntegration() {}

  deleteGuildRole() {}

  deleteWebhook() {}

  deleteWebhookWithToken() {}

  editChannel() {}

  /**
   * Edit a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {MessageEditOptions} options Message edit options
   * @returns {Promise<Message>}
   */
  async editChannelMessage(channelID, messageID, options) {
    const data = await this.request({
      auth: true,
      body: options,
      endpoint: endpoints.channelMessage(channelID, messageID),
      method: 'PATCH'
    });

    return new Message(data, this.client);
  }

  editChannelPermissionOverwrite() {}

  editGuild() {}

  editGuildChannelPositions() {}

  editGuildEmbed() {}

  editGuildEmoji() {}

  editGuildIntegration() {}

  editGuildSelfNick() {}

  editGuildRole() {}

  editGuildRolePositions() {}

  editSelf() {}

  executeWebhook() {}

  getChannel() {}

  /**
   * Get the invites of a channel
   * @arg {string} channelID The channel's ID
   * @returns {Promise<Invite>}
   */
  async getChannelInvites(channelID) {
    const data = await this.request({
      auth: true,
      endpoint: endpoints.channelInvites(channelID),
      method: 'GET'
    });

    return data.map((invite) => new Invite(invite, this.client));
  }

  /**
   * Get a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @returns {Promise<Message>}
   */
  async getChannelMessage(channelID, messageID) {
    const data = await this.request({
      auth: true,
      endpoint: endpoints.channelMessage(channelID, messageID),
      method: 'GET'
    });

    return new Message(data, this.client);
  }

  /**
   * Get a message reaction's users
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @arg {GetSearchOptions} [options] Options for the request
   * @returns {Promise<User[]>}
   */
  async getChannelMessageReactionUsers(channelID, messageID, emoji, options) {
    emoji = encodeURIComponent(emoji);

    const users = await this.request({
      auth: true,
      endpoint: endpoints.messageReaction(channelID, messageID, emoji),
      method: 'GET',
      query: options
    });

    return users.map((user) => new User(user, this.client));
  }

  /**
   * Get messages from a channel
   * @arg {string} channelID The channel's ID
   * @arg {ChannelMessagesOptions} [options] Message getting options
   * @returns {Promise<Message[]>}
   */
  async getChannelMessages(channelID, options) {
    const messages = await this.request({
      auth: true,
      endpoint: endpoints.channelMessages(channelID),
      method: 'GET',
      query: options
    });

    return messages.map((message) => new Message(message, this.client));
  }

  /**
   * Get a channel's pinned messages
   * @arg {string} channelID The channel's ID
   * @returns {Promise<Message[]>}
   */
  async getChannelPinnedMessages(channelID) {
    const messages = await this.request({
      auth: true,
      endpoint: endpoints.channelPins(channelID),
      method: 'GET'
    });

    return messages.map((message) => new Message(message, this.client));
  }

  getChannelWebhooks() {}

  getDMChannels() {}

  /**
   * Get gateway data
   * @arg {boolean} [auth] Whether to include bot metadata or not
   * @returns {Promise<any>}
   */
  getGateway(auth) {
    return this.request({
      auth,
      endpoint: auth ? endpoints.gatewayBot : endpoints.gateway,
      method: 'GET'
    });
  }

  getGuild() {}

  getGuildAuditLogs() {}

  getGuildBan() {}

  getGuildBans() {}

  getGuildChannels() {}

  getGuildEmbed() {}

  getGuildEmoji() {}

  getGuildEmojis() {}

  getGuildIntegrations() {}

  /**
   * Get a guild's invites
   * @arg {string} guildID The guild's ID
   * @returns {Promise<Invite[]>}
   */
  async getGuildInvites(guildID) {
    const data = await this.request({
      auth: true,
      endpoint: endpoints.guildInvites(guildID),
      method: 'GET'
    });

    return data.map((invite) => new Invite(invite, this.client));
  }

  getGuildMember() {}

  getGuildMembers() {}

  getGuildPruneCount() {}

  getGuildRoles() {}

  getGuildVanityURL() {}

  getGuildVoiceRegions() {}

  getGuildWidgetImage() {}

  getGuildWebhooks() {}

  /**
   * Get an invite
   * @arg {string} inviteCode The invite's code
   * @arg {boolean} [withCounts] Whether to  include approximate member counts
   * @returns {Promise<Invite>}
   */
  async getInvite(inviteCode, withCounts) {
    const data = await this.request({
      endpoint: endpoints.invite(inviteCode),
      query: {
        with_counts: !!withCounts
      }
    });

    return new Invite(data, this.client);
  }

  getUser() {}

  getWebhook() {}

  getWebhookWithToken() {}

  /**
   * Kick a member from a guild
   * @arg {string} guildID The guild's ID
   * @arg {string} memberID The member's ID
   * @arg {string} [reason] Reason for the kick
   * @returns {Promise<void>}
   */
  kickGuildMember(guildID, memberID, reason) {
    return this.request({
      auth: true,
      endpoint: endpoints.guildMember(guildID, memberID),
      method: 'DELETE',
      reason
    });
  }

  leaveGuild() {}

  /**
   * Pin a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  pinChannelMessage(channelID, messageID) {
    return this.request({
      auth: true,
      endpoint: endpoints.channelPin(channelID, messageID),
      method: 'PUT'
    });
  }

  pruneGuildMembers() {}

  removeGuildMemberRole() {}

  /**
   * Start typing in a channel
   * @arg {string} channelID The channel's ID
   * @returns {Promise<void>}
   */
  startChannelTyping(channelID) {
    return this.request({
      auth: true,
      endpoint: endpoints.channelTyping(channelID),
      method: 'POST'
    });
  }

  syncGuildIntegration() {}

  /**
   * Unban a user from a guild
   * @arg {string} guildID The guild's ID
   * @arg {string} userID The user's ID
   * @returns {Promise<void>}
   */
  unbanGuildUser(guildID, userID) {
    return this.request({
      auth: true,
      endpoint: endpoints.guildBan(guildID, userID),
      method: 'DELETE'
    });
  }

  /**
   * Unpin a message from a channel
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  unpinChannelMessage(channelID, messageID) {
    return this.request({
      auth: true,
      endpoint: endpoints.channelPin(channelID, messageID),
      method: 'DELETE'
    });
  }
}

module.exports = RESTManager;

const addFormField = (form, contentType, file) => {
  let str = `Content-Disposition: form-data; name="${form.name}"`;
  if (file) {
    str += `; filename="${form.name}"`;
  }
  return `${str}\nContent-Type: application/${contentType}\n\n${form.data}`;
};

const query = (fields) => {
  let str = '?';
  for (const key in fields) {
    str += `${encodeURIComponent(key)}=${encodeURIComponent(fields[key])}&`;
  }
  return str.slice(0, -1);
};

/**
 * @typedef {object} RESTManagerOptions
 * @prop {number} [version] REST version
 */

/**
 * @typedef {object} AroundOptions
 * @prop {string} around Messages around this ID
 */

/**
 * @typedef {object} BanMemberOptions
 * @prop {number} [deleteMessageDays] Number of days to delete messages
 * @prop {string} [reason] Reason for the ban
 */

/**
 * @typedef {MessageEditOptions & MessageOptions} ChannelMessageCreateOptions
 */

/**
 * @typedef {GetSearchOptions & AroundOptions} ChannelMessagesOptions
 */

/**
 * @typedef {object} CorddisFile
 * @prop {string} name File name
 * @prop {Buffer} data File data
 */

/**
 * @typedef {object} EmbedAuthorOptions
 * @prop {string} [name] Name of the author
 * @prop {string} [url] URL of the author
 * @prop {string} [icon_url] Icon URL of the author
 * @prop {string} [proxy_icon_url] Proxy URL of the author
 */

/**
 * @typedef {object} EmbedImageOptions
 * @prop {string} [url] URL of the image
 * @prop {string} [proxy_url] Proxy URL of the image
 * @prop {number} [height] Image height
 * @prop {number} [width] Image width
 */

/**
 * @typedef {object} EmbedFieldOptions
 * @prop {string} name Name of the field
 * @prop {string} value Value of the field
 * @prop {boolean} [inline] Whether the field should be inline or not
 */

/**
 * @typedef {object} EmbedFooterOptions
 * @prop {string} text Text of the footer
 * @prop {string} [icon_url] Icon URL of the footer
 * @prop {string} [proxy_icon_url] Proxy icon URL of the footer
 */

/**
 * @typedef {object} EmbedOptions
 * @prop {string} [title] Title of the embed
 * @prop {string} [description] Description of the embed
 * @prop {string} [url] URL of the embed
 * @prop {string} [timestamp] Timestamp of the embed
 * @prop {number} [color] Color of the embed
 * @prop {EmbedFooterOptions} [footer] Embed footer
 * @prop {EmbedImageOptions} [image] Embed image
 * @prop {EmbedThumbnailOptions} [thumbnail] Embed thumbnail
 * @prop {EmbedAuthorOptions} [author] Embed author
 * @prop {EmbedFieldOptions[]} [fields] Embed fields
 */

/**
 * @typedef {EmbedImageOptions} EmbedThumbnailOptions
 */

/**
  * @typedef {object} GetSearchOptions
  * @prop {number} [after] Users to get after this ID
  * @prop {number} [before] Users to get before this ID
  * @prop {number} [limit] Number of users to get
  */

/**
 * @typedef {object} InviteOptions
 * @prop {number} [maxAge] Time before the invite expires
 * @prop {number} [maxUses] Max use limit
 * @prop {boolean} [temporary] If the invite grants temporary membership
 * @prop {boolean} [unique] If the invite should be unique
 */

/**
 * @typedef {object} MessageEditOptions
 * @prop {string} [content] Message content
 * @prop {EmbedOptions} [embed] Embed options
 */

/**
 * @typedef {object} MessageOptions
 * @prop {CorddisFile[]} [files] Files to send
 * @prop {string | number} [nonce] A value used for optimistic message sending
 * @prop {boolean} [tts] Whether the message should be sent with TTS on
 */
