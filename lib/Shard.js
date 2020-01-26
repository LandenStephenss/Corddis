const EventEmitter = require('events');
const codec = require('./codec');

const Guild = require('./structures/Guild');
const Message = require('./structures/Message');
const User = require('./structures/User');

const HELLO = 10;

const UNKNOWN_ERROR = 4000;
const UNKNOWN_OPCODE = 4001;
const DECODE_ERROR = 4002;
const NOT_AUTHENTICATED = 4003;
const AUTHENTICATION_FAILED = 4004;
const ALREADY_AUTHENTICATED = 4005;
const INVALID_SEQ = 4007;
const RATE_LIMITED = 4008;
const SESSION_TIMEOUT = 4009;
const INVALID_SHARD = 4010;
const SHARDING_REQUIRED = 4011;

class Shard extends EventEmitter {
  
  constructor(id, client) {
    super();
    this.client = client;
    this.id = id;
    this.seq = null;
    this.sessionID = null;
    this.ws = null;
    this.heartbeatInterval = null;
  }

  connect(url, options) {
    const ws = this.ws = new codec.WebSocket(url, options.ws);

    ws.on('message', (message) => this.onWSMessage(message));
    ws.on('close', (code, reason) => this.onWSClose(code, reason));

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

  onWSClose(error, code) {
    switch (code) {
      case UNKNOWN_ERROR: {
        break;
      }

      case UNKNOWN_OPCODE: {
        break;
      }

      case DECODE_ERROR: {
        break;
      }

      case NOT_AUTHENTICATED: {
        break;
      }

      case AUTHENTICATION_FAILED: {
        break;
      }

      case ALREADY_AUTHENTICATED: {
        break;
      }

      case INVALID_SEQ: {
        break;
      }

      case RATE_LIMITED: {
        break;
      }

      case SESSION_TIMEOUT: {
        break;
      }

      case INVALID_SHARD: {
        break;
      }

      case SHARDING_REQUIRED: {
        break;
      }
    }
  }

  onWSMessage(message) {
    const packet = codec.decode(message);
    const data = packet.d;
    this.seq = packet.s;

    const client = this.client;

    switch (packet.op) {
      case HELLO: {
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
          client._unavailableGuilds.set(unavailableGuild.id, {
            id: unavailableGuild.id
          });
        }
        break;
      }

      case 'GUILD_CREATE': {
        if (client._unavailableGuilds.has(data.id)) {
          client._unavailableGuilds.delete(data.id);
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
        }
        else {
          this.emit('guildDelete', client.guilds.remove(data));
        }
        break;
      }

      case 'MESSAGE_CREATE': {
        console.log(client);
        this.emit('messageCreate', new Message(data, client));
        break;
      }
    }
  }

  heartbeat() {
    this.sendWS(1, this.seq);
  }

  updateStatus(options) {
    this.sendWS(3, {
      since: options.since,
      game: options.game,
      status: options.status,
      afk: options.afk
    });
  }

  emit(event, ...args) {
    this.client.gateway.emit(event, ...args, this);
    return super.emit(event, ...args);
  }
}

module.exports = Shard;
