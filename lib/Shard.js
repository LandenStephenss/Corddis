const EventEmitter = require('events');
const codec = require('./codec');
const Collection = require('./Collection');

const {
  REQUEST_GUILD_MEMBERS_TIMEOUT,
  opcodes,
  gatewayCloseCodes
} = require('./constants');

const {
  Channel,
  Emoji,
  Message,
  User
} = require('./structures');

/**
 * Class representing a shard
 * @extends {EventEmitter}
 */
class Shard extends EventEmitter {
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

    const client = this.client;

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

    switch (packet.t) {

      case 'READY': {
        this.sessionID = data.session_id;
        client.user = client.users.add(data.user, client);

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
        }
        else {
          channel = Channel.from(data, client);
        }
        this.emit('channelCreate', {
          channel: client.channels.add(channel)
        });
        break;
      }

      case 'CHANNEL_UPDATE': {
        const channel = client.channels.get(data.channel.id);
        const oldChannel = {
          ...channel
        };
        channel.update(data);
        this.emit('channelUpdate', {
          newChannel: channel,
          oldChannel
        });
        break;
      }

      case 'CHANNEL_DELETE': {
        if (data.guild_id) {
          const guild = client.guilds.get(data.guild_id);
          guild.channels.remove(data);
        }
        this.emit('channelDelete', {
          channel: client.channels.remove(data)
        });
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
          this.emit('guildAvailable', {
            guild
          });
          break;
        }
        this.emit('guildCreate', {
          guild: client.guilds.add(data, this)
        });
        break;
      }

      case 'GUILD_UPDATE': {
        const guild = client.guilds.get(data.id);
        const oldGuild = {
          ...guild
        };
        guild.update(data);
        this.emit('guildUpdate', {
          newGuild: guild,
          oldGuild
        });
        break;
      }

      case 'GUILD_DELETE': {
        const guild = client.guilds.get(data.id);
        if (data.unavailable) {
          guild.available = false;
          this.emit('guildUnavailable', {
            guild
          });
          break;
        }
        this.emit('guildDelete', {
          guild: client.guilds.remove(data)
        });
        break;
      }

      case 'GUILD_BAN_ADD': {
        this.emit('guildBanAdd', {
          user: new User(data.user, client),
          guild: client.guilds.get(data.guild_id)
        });
        break;
      }

      case 'GUILD_BAN_REMOVE': {
        const guild = client.guilds.get(data.guild_id);
        this.emit('guildBanRemove', {
          user: new User(data.user, client),
          guild
        });
        break;
      }

      case 'GUILD_EMOJIS_UPDATE': {
        const guild = client.guilds.get(data.guild_id);
        guild.emojis = new Collection(Emoji, data.emojis, guild);
        this.emit('guildEmojisUpdate', {
          guild
        });
        break;
      }

      case 'GUILD_INTEGRATIONS_UPDATE': {
        this.emit('guildIntegrationsUpdate', {
          guild: client.guilds.get(data.guild_id)
        });
        break;
      }

      case 'GUILD_MEMBER_ADD': {
        const guild = client.guilds.get(data.guild_id);
        this.emit('guildMemberAdd', {
          member: guild.members.add(data, guild),
          guild
        });
        break;
      }

      case 'GUILD_MEMBER_UPDATE': {
        const guild = client.guilds.get(data.guild_id);
        const member = guild.members.get(data.user.id);
        if (!member) {
          guild.members.add(data, guild);
          break;
        }
        const oldMember = {
          ...member
        };
        member.update(member);
        this.emit('guildMemberUpdate', {
          newMember: member,
          oldMember
        });
        break;
      }

      case 'GUILD_MEMBER_REMOVE': {
        const guild = client.guilds.get(data.guild_id);
        const member = guild.members.remove(data);

        if (member.user.mutualGuilds.length === 0) {
          client.users.remove(member.user);
        }

        this.emit('guildMemberRemove', {
          member,
          guild
        });
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
        this.emit('guildRoleCreate', {
          role: guild.roles.add(data, guild),
          guild
        });
        break;
      }

      case 'GUILD_ROLE_UPDATE': {
        const guild = client.guilds.get(data.guild_id);
        const role = guild.roles.get(data.role.id);
        const oldRole = {
          ...role
        };
        role.update(data);
        this.emit('guildRoleUpdate', {
          newRole: role,
          oldRole,
          guild
        });
        break;
      }

      case 'GUILD_ROLE_DELETE': {
        const guild = client.guilds.get(data.guild_id);
        this.emit('guildRoleDelete', {
          role: guild.roles.remove(data),
          guild
        });
        break;
      }

      case 'MESSAGE_CREATE': {
        this.emit('messageCreate', {
          message: new Message(data, client)
        });
        break;
      }

      case 'MESSAGE_UPDATE': {
        if (!data.edited_timestamp) {
          break;
        }
        this.emit('messageUpdate', {
          message: new Message(data, client)
        });
        break;
      }

      case 'MESSAGE_DELETE': {
        this.emit('messageDelete', {
          messageID: data.message_id,
          channel: client.channels.get(data.channel_id),
          guild: client.guilds.get(data.guild_id)
        });
        break;
      }

      case 'MESSAGE_DELETE_BULK': {
        this.emit('messageDelete', {
          messageIDs: data.ids,
          channel: client.channels.get(data.channel_id),
          guild: client.channels.get(data.guild_id)
        });
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
        const presence = guild.presences.get(data.user.id);
        if (!presence) {
          this.emit('presenceUpdate', {
            newPresence: guild.presences.add(data, guild),
            oldPresence: null,
            guild
          });
          break;
        }
        if (data.status === 'offline') {
          this.emit('presenceUpdate', {
            newPresence: null,
            oldPresence: guild.presences.remove(presence),
            guild
          });
          break;
        }

        const oldPresence = {
          ...presence
        };
        presence.update(data);
        this.emit('presenceUpdate', {
          newPresence: presence,
          oldPresence,
          guild
        });
        break;
      }

      case 'TYPING_START': {
        break;
      }

      case 'USER_UPDATE': {
        const user = client.users.get(data.id);
        const oldUser = {
          ...user
        };
        user.update(data);
        this.emit('userUpdate', {
          newUser: user,
          oldUser
        });
        break;
      }

      case 'VOICE_STATE_UPDATE': {
        const guild = client.guilds.get(data.guild_id);
        const voiceState = guild.voiceStates.get(data.user_id);
        if (!voiceState) {
          this.emit('voiceStateUpdate', {
            newVoiceState: guild.voiceStates.add(data, guild),
            oldVoiceState: null,
            guild
          });
          break;
        }
        if (!data.channel_id) {
          this.emit('VoiceStateUpdate', {
            newVoiceState: null,
            oldVoiceState: guild.voiceStates.remove(voiceState),
            guild
          });
          break;
        }

        const oldVoiceState = {
          ...voiceState
        };
        voiceState.update(data);
        this.emit('voiceStateUpdate', {
          newVoiceState: voiceState,
          oldVoiceState,
          guild
        });
        break;
      }

      case 'VOICE_SERVER_UPDATE': {
        break;
      }

      case 'WEBHOOKS_UPDATE': {
        this.emit('webhooksUpdate', {
          channel: client.channels.get(data.channel_id),
          guild: client.guilds.get(data.guild_id)
        });
        break;
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
    } : options.game;

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

  emit(event, data) {
    this.client.gateway.emit(event, {
      ...data,
      shard: this
    });
    return super.emit(event, data);
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
