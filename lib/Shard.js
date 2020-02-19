const EventEmitter = require('events');
const constants = require('./constants');
const codec = require('./codec');

const {
  Channel,
  Message,
  Presence,
  User
} = require('./structures');

class Shard extends EventEmitter {
  ready = false;
  seq = null;
  sessionID = null;
  heartbeatACK = 0;
  heartbeatInterval = null;
  heartbeatSent = 0;
  ws = null;

  constructor(id, client) {
    super();
    this.client = client;
    this.id = id;
  }

  get ping() {
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
      intents: this.client.gateway.intents,
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
    console.log(error, code);
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

      case 11: {
        this.heartbeatACK = Date.now();
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

      case 'CHANNEL_CREATE': {
        let channel;
        if (data.guild_id) {
          const guild = client.guilds.get(data.guild_id);
          channel = guild.channels.add(Channel.from(data, guild));
          client.channels.add(channel);
        }
        else {
          channel = Channel.from(data, client);
          client.channels.add(Channel.from(data, client));
        }
        this.emit('channelCreate', channel);
        break;
      }

      case 'CHANNEL_UPDATE': {
        break;
      }

      case 'CHANNEL_DELETE': {
        if (data.guild_id) {
          const guild = client.guilds.get(data.guild_id);
          guild.channels.remove(data);
        }
        this.emit('channelDelete', client.channels.remove(data));
        break;
      }

      case 'CHANNEL_PINS_UPDATE': {
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

      case 'GUILD_UPDATE': {
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

      case 'GUILD_BAN_ADD': {
        const guild = client.guilds.get(data.guild_id);
        this.emit('guildBanAdd', new User(data.user, client), guild);
        break;
      }

      case 'GUILD_BAN_REMOVE': {
        const guild = client.guilds.get(data.guild_id);
        this.emit('guildBanRemove', new User(data.user, client), guild);
        break;
      }

      case 'GUILD_EMOJIS_UPDATE': {
        this.emit('guildEmojisUpdate', client.guilds.get(data.guild_id));
        break;
      }

      case 'GUILD_INTEGRATIONS_UPDATE': {
        this.emit('guildIntegrationsUpdate', client.guilds.get(data.guild_id));
        break;
      }

      case 'GUILD_MEMBER_ADD': {
        const guild = client.guilds.get(data.guild_id);
        this.emit('guildMemberAdd', guild.members.add(data, guild), guild);
        break;
      }

      case 'GUILD_MEMBER_UPDATE': {
        break;
      }

      case 'GUILD_MEMBER_REMOVE': {
        const guild = client.guilds.get(data.guild_id);
        this.emit('guildMemberRemove', guild.members.remove(data), guild);
        break;
      }

      case 'GUILD_MEMBERS_CHUNK': {
        const guild = client.guilds.get(data.guild_id);
        for (const member of data.members) {
          guild.members.add(member, guild);
        }
        const queue = this.client.gateway._guildMembersQueue.get(guild.id);
        if (data.not_found) {
          queue.notFound.push(...data.not_found);
        }
        if (data.members.length < 1000) {
          this._clearGuildMembersQueue(guild.id);
        }
        break;
      }

      case 'GUILD_ROLE_CREATE': {
        const guild = client.guilds.get(data.guild_id);
        this.emit('guildRoleCreate', guild.roles.add(data, guild), guild);
        break;
      }

      case 'GUILD_ROLE_UPDATE': {
        break;
      }

      case 'GUILD_ROLE_DELETE': {
        const guild = client.guilds.get(data.guild_id);
        this.emit('guildRoleDelete', guild.roles.remove(data), guild);
        break;
      }

      case 'MESSAGE_CREATE': {
        this.emit('messageCreate', new Message(data, client));
        break;
      }

      case 'MESSAGE_UPDATE': {
        if (!data.edited_timestamp) {
          break;
        }
        this.emit('messageUpdate', new Message(data, client));
        break;
      }

      case 'MESSAGE_DELETE': {
        const channel = client.channels.get(data.channel_id);
        const guild = client.guilds.get(data.guild_id);
        this.emit('messageDelete', data.message_id, channel, guild);
        break;
      }

      case 'MESSAGE_DELETE_BULK': {
        const channel = client.channels.get(data.channel_id);
        const guild = client.channels.get(data.guild_id);
        this.emit('messageDelete', data.ids, channel, guild);
        break;
      }

      case 'MESSAGE_REACTION_ADD': {
        break;
      }

      case 'MESSAGE_REACTION_REMOVE': {
        break;
      }

      case 'MESSAGE_REACTION_REMOVE_ALL': {
        break;
      }

      case 'PRESENCE_UPDATE': {
        const guild = client.guilds.get(data.guild_id);
        const presence = new Presence(data, guild);
        this.emit('presenceUpdate', presence, guild);
        break;
      }

      case 'TYPING_START': {
        break;
      }

      case 'USER_UPDATE': {
        break;
      }

      case 'VOICE_STATE_UPDATE': {
        break;
      }

      case 'VOICE_SERVER_UPDATE': {
        break;
      }

      case 'WEBHOOKS_UPDATE': {
        const channel = client.channels.get(data.channel_id);
        const guild = client.guilds.get(data.guild_id);
        this.emit('webhooksUpdate', channel, guild);
        break;
      }
    }
  }

  heartbeat() {
    this.heartbeatSent = Date.now();
    this.sendWS(1, this.seq);
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
    } : options.game;

    this.sendWS(3, {
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
    this.sendWS(8, {
      guild_id: guildID,
      query: options.query || '',
      limit: options.limit || 0,
      presences: !!options.presences,
      user_ids: options.userIDs || null
    });

    const func = () => this._clearGuildMembersQueue(guildID);
    const timeout = options.timeout || constants.REQUEST_GUILD_MEMBERS_TIMEOUT;

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

/**
  * @typedef {object} RequestGuildMembersOptions
  * @prop {number} [limit] Number of members to request for (0 for not limit)
  * @prop {boolean} [presences] Whether to include presence data or not
  * @prop {string} [query] String that users' usernames start with
  * @prop {number} [timeout] Time in milliseconds to wait for all the chunks
  * @prop {string[]} [userIDs] Users to specifically request for
  */
