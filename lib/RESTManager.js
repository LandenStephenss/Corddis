const https = require('https');
const pkg = require('../package');

const Message = require('./structures/Message');

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
   * Get gateway data
   * @arg {boolean} [auth] Whether to include bot metadata or not
   * @returns {Promise<any>}
   */
  getGateway(auth) {
    return this.request({
      auth,
      endpoint: `gateway${auth ? '/bot' : ''}`,
      method: 'GET'
    });
  }

  /**
   * Send a message to a channel
   * @arg {string} channelID The channel to send the message to
   * @arg {MessageOptions} options Message options
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
      endpoint: `channels/${channelID}/messages`,
      method: 'POST'
    };
    if ('files' in options) {
      data.files = options.files;
    }

    const message = await this.request(data);
    return new Message(message, this.client);
  }

  /**
   * Delete a message
   * @arg {string} channelID The channel's ID
   * @arg {string} messageID The message's ID
   * @arg {string} [reason] Reason to delete this message
   * @returns {Promise<void>}
   */
  async deleteMessage(channelID, messageID, reason) {
    return this.request({
      auth: true,
      endpoint: `channels/${channelID}/messages/${messageID}`,
      method: 'DELETE',
      reason
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
