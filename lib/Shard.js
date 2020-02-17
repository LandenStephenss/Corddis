const EventEmitter = require('events');
const constants = require('./constants');
const codec = require('./codec');

const {
  Message,
  User
} = require('./structures');

class Shard extends EventEmitter {
  seq = null;
  sessionID = null;
  ws = null;
  heartbeatInterval = null;
  ready = false;
  
  constructor(id, client) {
    super();
    this.client = client;
    this.id = id;
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

    this.ws.send(codec.encode(packet));
  }

  identify(options) {
    const properties = {
      $browser: 'Corddis',
      $device: 'Corddis',
      $os: process.platform
    };

    this.sendWS(2, {
      guild_subscriptions: options.guildSubscriptions,
      large_threshold: options.largeThreshold,
      presence: options.presence,
      properties,
      shard: [this.id, this.client.gateway.shards.length],
      token: this.client.token
    });
  }

  resume() {
    this.sendWS(6, {
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

  _onWSClose(error, code) {
    switch (code) {

      case constants.UNKNOWN_ERROR: {
        break;
      }

      case constants.UNKNOWN_OPCODE: {
        break;
      }

      case constants.DECODE_ERROR: {
        break;
      }

      case constants.NOT_AUTHENTICATED: {
        break;
      }

      case constants.AUTHENTICATION_FAILED: {
        break;
      }

      case constants.ALREADY_AUTHENTICATED: {
        break;
      }

      case constants.INVALID_SEQ: {
        break;
      }

      case constants.RATE_LIMITED: {
        break;
      }

      case constants.SESSION_TIMEOUT: {
        break;
      }

      case constants.INVALID_SHARD: {
        break;
      }

      case constants.SHARDING_REQUIRED: {
        break;
      }
    }
  }

  _onWSMessage(message) {
    const packet = codec.decode(message);
    const data = packet.d;
    this.seq = packet.s;

    const client = this.client;

    switch (packet.op) {

      case constants.HELLO: {
        const func = () => this.heartbeat();
        this.heartbeatInterval = setInterval(func, data.heartbeat_interval);
        break;
      }
    }

    switch (packet.t) {

      case 'READY': {
        this.sessionID = data.session_id;
        client.user = new User(data.user, client);

        for (const unavailableGuild of data.guilds) {
          client.gateway._unavailableGuilds.set(unavailableGuild.id, {
            id: unavailableGuild.id
          });
        }

        this.ready = true;
        this.emit('shardReady');

        if (this.client.gateway.shards.every((shard) => shard.ready)) {
          this.client.gateway.emit('ready');
        }
        break;
      }

      case 'GUILD_CREATE': {
        if (client.gateway._unavailableGuilds.has(data.id)) {
          client.gateway._unavailableGuilds.delete(data.id);
          client.guilds.add(data, this);
          break;
        }
        const guild = client.guilds.get(data.id);
        if (guild) {
          guild.available = true;
          this.emit('guildAvailable', guild);
          break;
        }
        this.emit('guildCreate', client.guilds.add(data, this));
        break;
      }

      case 'GUILD_DELETE': {
        const guild = client.guilds.get(data.id);
        if (data.unavailable) {
          guild.available = false;
          this.emit('guildUnavailable', guild);
          break;
        }
        this.emit('guildDelete', client.guilds.remove(data));
        break;
      }

      case 'MESSAGE_CREATE': {
        this.emit('messageCreate', new Message(data, client));
        break;
      }
    }
  }

  heartbeat() {
    this.sendWS(1, this.seq);
  }

  /**
   * Update status
   * @arg {StatusOptions} options Status options
   * @returns {void}
   */
  updateStatus(options) {
    const game = typeof options.game === 'string' ? {
      game: options.game,
      type: 0
    } : options.game;

    this.sendWS(3, {
      afk: !!options.afk,
      game,
      since: options.since || null,
      status: options.status || null
    });
  }

  emit(event, ...args) {
    this.client.gateway.emit(event, ...args, this);
    return super.emit(event, ...args);
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
