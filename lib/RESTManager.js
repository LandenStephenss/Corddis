const endpoints = require('./endpoints');
const https = require('https');
const pkg = require('../package');

const {
  Message
} = require('./structures');

const REST_VERSION = 6;

class RESTManager {

  constructor(client) {
    this.client = client;
  }

  request(options) {
    let path = `/api/v${REST_VERSION}/${options.endpoint}`;
    if ('query' in options) {
      path += query(options.query);
    }

    const headers = {
      Authorization: options.auth ? this.client.token : null,
      'User-Agent': `DiscordBot (${pkg.homepage}, ${pkg.version})`,
      'X-Audit-Log-Reason': 'reason' in options ? options.reason : null
    };

    let data = '';
    if ('files' in options) {
      headers['Content-Type'] = 'multipart/form-data; boundary=----corddis';
      for (const file of options.files) {
        data += `------corddis\n${addFormField(file, 'octet-stream', true)}\n`;
      }

      if ('body' in options) {
        const form = {
          name: 'payload_json',
          data: JSON.stringify(options.body)
        };
        data += `------corddis\n${addFormField(form, 'json')}\n`;
      }

      data += '------corddis--';
    }
    else if ('body' in options) {
      headers['Content-Type'] = 'application/json';
      data = JSON.stringify(options.body);
    }

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

  /**
   * React to a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @returns {Promise<void>}
   */
  addMessageReaction(channelID, messageID, emoji) {
    return this.request({
      auth: true,
      endpoint: endpoints.USER_REACTION(channelID, messageID, emoji, '@me'),
      method: 'PUT'
    });
  }

  /**
   * Remove a user's reaction from a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @arg {string} userID The user's ID (or "@me" for the client)
   * @returns {Promise<void>}
   */
  removeMessageReaction(channelID, messageID, emoji, userID) {
    return this.request({
      auth: true,
      endpoint: endpoints.USER_REACTION(channelID, messageID, emoji, userID),
      method: 'DELETE'
    });
  }

  /**
   * Get a message reaction's users
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {string} emoji The encoded emoji
   * @arg {GetSearchOptions} [options] Options for the request
   * @returns {Promise<User[]>}
   */
  getMessageReactionUsers(channelID, messageID, emoji, options) {
    return this.request({
      auth: true,
      endpoint: endpoints.MESSAGE_REACTION(channelID, messageID, emoji),
      method: 'GET',
      query: options
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
      endpoint: endpoints.MESSAGE_REACTIONS(channelID, messageID),
      method: 'DELETE'
    });
  }

  /**
   * Get gateway data
   * @arg {boolean} [auth] Whether to include bot metadata or not
   * @returns {Promise<any>}
   */
  getGateway(auth) {
    return this.request({
      auth,
      endpoint: auth ? endpoints.GATEWAY_BOT : endpoints.GATEWAY,
      method: 'GET'
    });
  }

  /**
   * Get a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @returns {Promise<Message>}
   */
  async getMessage(channelID, messageID) {
    const data = await this.request({
      auth: true,
      endpoint: endpoints.CHANNEL_MESSAGE(channelID, messageID),
      method: 'GET'
    });

    return new Message(data, this.client);
  }

  /**
   * Get messages from a channel
   * @arg {string} channelID The channel's ID
   * @arg {ChannelMessagesOptions} options Message getting options
   * @returns {Promise<Message[]>}
   */
  async getMessages(channelID, options) {
    const messages = await this.request({
      auth: true,
      endpoint: endpoints.CHANNEL_MESSAGES(channelID),
      method: 'GET',
      query: options
    });

    return messages.map((message) => new Message(message, this.client));
  }

  /**
   * Send a message to a channel
   * @arg {string} channelID The channel to send the message to
   * @arg {MessageCreateOptions} options Message create options
   * @returns {Promise<Message>}
   */
  async createMessage(channelID, options) {
    const body = typeof options === 'string' ? {
      content: options
    } : {
      content: options.content,
      embed: options.embed,
      nonce: options.nonce,
      tts: options.tts
    };

    const data = {
      auth: true,
      body,
      endpoint: endpoints.CHANNEL_MESSAGES(channelID),
      method: 'POST'
    };
    if (typeof options === 'object' && 'files' in options) {
      data.files = options.files;
    }

    const message = await this.request(data);
    return new Message(message, this.client);
  }

  /**
   * Edit a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {MessageEditOptions} options Message edit options
   * @returns {Promise<Message>}
   */
  async editMessage(channelID, messageID, options) {
    const data = await this.request({
      auth: true,
      body: options,
      endpoint: endpoints.CHANNEL_MESSAGE(channelID, messageID),
      method: 'PATCH'
    });

    return new Message(data, this.client);
  }

  /**
   * Delete a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {string} [reason] Reason to delete the message
   * @returns {Promise<void>}
   */
  deleteMessage(channelID, messageID, reason) {
    return this.request({
      auth: true,
      endpoint: endpoints.CHANNEL_MESSAGE(channelID, messageID),
      method: 'DELETE',
      reason
    });
  }

  /**
   * Delete messages from a channel
   * @arg {string} channelID The channel's ID
   * @arg {string[]} messageIDs Array of message IDs
   * @returns {Promise<void>}
   */
  deleteMessages(channelID, messageIDs) {
    return this.request({
      auth: true,
      body: {
        messages: messageIDs
      },
      endpoint: endpoints.CHANNEL_BULK_DELETE(channelID),
      method: 'DELETE'
    });
  }

  /**
   * Pin a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  pinMessage(channelID, messageID) {
    return this.request({
      auth: true,
      endpoint: endpoints.CHANNEL_MESSAGE(channelID, messageID),
      method: 'PUT'
    });
  }

  /**
   * Unpin a message from a channel
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @returns {Promise<void>}
   */
  unpinMessage(channelID, messageID) {
    return this.request({
      auth: true,
      endpoint: endpoints.CHANNEL_MESSAGE(channelID, messageID),
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
 * @typedef {MessageEditOptions & MessageOptions} MessageCreateOptions
 */

/**
 * @typedef {object} MessageOptions
 * @prop {CorddisFile[]} [files] Files to send
 * @prop {string | number} [nonce] A value used for optimistic message sending
 * @prop {boolean} [tts] Whether the message should be sent with TTS on
 */

/**
 * @typedef {object} MessageEditOptions
 * @prop {string} [content] Message content
 * @prop {EmbedOptions} [embed] Embed options
 */

/**
 * @typedef {object} CorddisFile
 * @prop {string} name File name
 * @prop {Buffer} data File data
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
 * @typedef {object} EmbedFooterOptions
 * @prop {string} text Text of the footer
 * @prop {string} [icon_url] Icon URL of the footer
 * @prop {string} [proxy_icon_url] Proxy icon URL of the footer
 */

/**
 * @typedef {object} EmbedImageOptions
 * @prop {string} [url] URL of the image
 * @prop {string} [proxy_url] Proxy URL of the image
 * @prop {number} [height] Image height
 * @prop {number} [width] Image width
 */

/**
 * @typedef {EmbedImageOptions} EmbedThumbnailOptions
 */

/**
 * @typedef {object} EmbedAuthorOptions
 * @prop {string} [name] Name of the author
 * @prop {string} [url] URL of the author
 * @prop {string} [icon_url] Icon URL of the author
 * @prop {string} [proxy_icon_url] Proxy URL of the author
 */

/**
 * @typedef {object} EmbedFieldOptions
 * @prop {string} name Name of the field
 * @prop {string} value Value of the field
 * @prop {boolean} [inline] Whether the field should be inline or not
 */

/**
  * @typedef {object} GetSearchOptions
  * @prop {number} [after] Users to get after this ID
  * @prop {number} [before] Users to get before this ID
  * @prop {number} [limit] Number of users to get
  */

/**
 * @typedef {object} AroundOptions
 * @prop {string} around Messages around this ID
 */

/**
 * @typedef {GetSearchOptions & AroundOptions} ChannelMessagesOptions
 */
