const codec = require('./codec');
const eventHandler = require('./eventHandler');

const {
  CorddisEmitter,
  logger
} = require('./util');

const {
  gatewayCloseCodes,
  opcodes,
  REQUEST_GUILD_MEMBERS_TIMEOUT
} = require('./constants');

/**
 * Class representing a shard
 * @extends {CorddisEmitter}
 */
class Shard extends CorddisEmitter {
  ready = false;
  seq = null;
  sessionID = null;
  heartbeatACK = 0;
  heartbeatInterval = null;
  heartbeatSent = 0;
  ws = null;

  /**
   * @arg {number} id ID of this shard
   * @arg {Client} client Client to initialize this shard
   */
  constructor(id, client) {
    super();
    this.client = client;
    this.id = id;
  }

  get latency() {
    return this.heartbeatACK - this.heartbeatSent;
  }

  connect(url, options) {
    const ws = this.ws = new codec.WebSocket(url, options.ws);

    ws.on('message', (message) => this._onWSMessage(message));
    ws.on('close', (code, reason) => this._onWSClose(code, reason));

    return new Promise((resolve) => {
      ws.once('open', () => {
        resolve();
        this.reconnect(options);
      });
    });
  }

  sendWS(opcode, data) {
    const packet = {
      op: opcode,
      d: data
    };

    logger.debug(`Sending packet ${opcode} to the gateway`);
    this.ws.send(codec.encode(packet));
  }

  identify(options) {
    const properties = {
      $browser: 'Corddis',
      $device: 'Corddis',
      $os: process.platform
    };

    this.sendWS(opcodes.IDENTIFY, {
      guild_subscriptions: options.guildSubscriptions,
      intents: this.client.gateway.intents,
      large_threshold: options.largeThreshold,
      presence: options.presence,
      properties,
      shard: [this.id, this.client.gateway.shards.length],
      token: this.client.token
    });
  }

  resume() {
    this.sendWS(opcodes.RESUME, {
      seq: this.seq,
      session_id: this.sessionID,
      token: this.client.token
    });
  }

  reconnect(options) {
    if (this.sessionID) {
      this.resume();
    }
    else {
      this.identify(options);
    }
  }

  _onWSClose(code, reason) { // eslint-disable-line no-unused-vars
    switch (code) {

      case gatewayCloseCodes.UNKNOWN_ERROR: {
        break;
      }

      case gatewayCloseCodes.UNKNOWN_OPCODE: {
        break;
      }

      case gatewayCloseCodes.DECODE_ERROR: {
        break;
      }

      case gatewayCloseCodes.NOT_AUTHENTICATED: {
        break;
      }

      case gatewayCloseCodes.AUTHENTICATION_FAILED: {
        break;
      }

      case gatewayCloseCodes.ALREADY_AUTHENTICATED: {
        break;
      }

      case gatewayCloseCodes.INVALID_SEQ: {
        break;
      }

      case gatewayCloseCodes.RATE_LIMITED: {
        break;
      }

      case gatewayCloseCodes.SESSION_TIMEOUT: {
        break;
      }

      case gatewayCloseCodes.INVALID_SHARD: {
        break;
      }

      case gatewayCloseCodes.SHARDING_REQUIRED: {
        break;
      }

      case gatewayCloseCodes.INVALID_VERSION: {
        break;
      }

      case gatewayCloseCodes.INVALID_INTENTS: {
        break;
      }

      case gatewayCloseCodes.DISALLOWED_INTENTS: {
        break;
      }
    }
  }

  _onWSMessage(message) {
    const packet = codec.decode(message);
    const data = packet.d;
    this.seq = packet.s;

    switch (packet.op) {

      case opcodes.HELLO: {
        const func = () => this.heartbeat();
        this.heartbeatInterval = setInterval(func, data.heartbeat_interval);
        break;
      }

      case opcodes.HEARTBEAT_ACK: {
        this.heartbeatACK = Date.now();
        break;
      }
    }

    if (packet.t) {
      if (packet.t in eventHandler) {
        eventHandler[packet.t](data, this, this.client);
      }
      else {
        this.ensue('unknownEvent', data);
      }
    }
  }

  heartbeat() {
    this.heartbeatSent = Date.now();
    this.sendWS(opcodes.HEARTBEAT, this.seq);
  }

  /**
   * Update status
   * @arg {StatusOptions} options Status options
   * @returns {void}
   */
  updateStatus(options) {
    const game = typeof options.game === 'string' ? {
      name: options.game,
      type: 0
    } : options.game || null;

    this.sendWS(opcodes.STATUS_UPDATE, {
      afk: !!options.afk,
      game,
      since: options.since || null,
      status: options.status || null
    });
  }

  /**
   * Request a guild's members
   * @arg {string} guildID The guild's ID
   * @arg {RequestGuildMembersOptions} [options] Request guild members options
   * @returns {Promise<void>}
   */
  requestGuildMembers(guildID, options = {}) {
    this.sendWS(opcodes.REQUEST_GUILD_MEMBERS, {
      guild_id: guildID,
      query: options.query || '',
      limit: options.limit || 0,
      presences: !!options.presences,
      user_ids: options.userIDs || null
    });

    const func = () => this._clearGuildMembersQueue(guildID);
    const timeout = options.timeout || REQUEST_GUILD_MEMBERS_TIMEOUT;

    return new Promise((resolve, reject) => {
      this.client.gateway._guildMembersQueue.set(guildID, {
        resolve,
        reject,
        notFound: [],
        timeout: setTimeout(func, timeout)
      });
    });
  }

  _clearGuildMembersQueue(guildID) {
    const gatewayManager = this.client.gateway;
    const queue = gatewayManager._guildMembersQueue.get(guildID);

    clearTimeout(queue.timeout);

    if (queue.notFound.length > 0) {
      queue.reject(queue.notFound);
    }
    else {
      queue.resolve(null); // For consistency purposes
    }
    gatewayManager._guildMembersQueue.delete(guildID);
  }

  ensue(event, data) {
    this.client.gateway.ensue(event, {
      ...data,
      shard: this
    });
    return super.ensue(event, data);
  }
}

module.exports = Shard;

/**
 * @typedef {object} StatusOptions
 * @prop {boolean} [afk] Whether the shard is AFK or not
 * @prop {string | GameOptions} [game] Shard game
 * @prop {number} [since] Time since when the client went idle
 * @prop {string} [status] Shard status
 */

/**
 * @typedef {object} GameOptions
 * @prop {string} name Name of the game
 * @prop {string} type The type of game
 * @prop {string} [url] Twitch URL (only if streaming)
 */

/**
  * @typedef {object} RequestGuildMembersOptions
  * @prop {number} [limit] Number of members to request for (0 for not limit)
  * @prop {boolean} [presences] Whether to include presence data or not
  * @prop {string} [query] String that users' usernames start with
  * @prop {number} [timeout] Time in milliseconds to wait for all the chunks
  * @prop {string[]} [userIDs] Users to specifically request for
  */
