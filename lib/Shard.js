const codec = require('./codec');

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

class Shard {
  
  constructor(id, client) {
    this.client = client;
    this.id = id;
    this.seq = null;
    this.sessionID = null;
    this.ws = null;
  }

  connect(url, options) {
    const ws = this.ws = new codec.WebSocket(url, options.ws);

    ws.on('message', (message) => this.onWSMessage(message));
    ws.on('close', (code, reason) => this.onWSClose(code, reason));

    return new Promise((resolve) => {
      ws.once('open', () => {
        resolve();
        this.reconnect();
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
    const data = codec.decode(message);
    console.log(data);
  }

  updateStatus(options) {
    this.sendWS(3, {
      since: options.since,
      game: options.game,
      status: options.status,
      afk: options.afk
    });
  }
}

module.exports = Shard;
