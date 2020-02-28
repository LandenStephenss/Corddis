const codec = require('./codec');
const CorddisEmitter = require('./CorddisEmitter');
const logger = require('./logger');
const Shard = require('./Shard');
const util = require('./util');

const {
  intents,
  SHARD_CONNECT_DELAY,
  versions
} = require('./constants');

/**
 * Class representing a gateway manager
 * @extends {CorddisEmitter}
 */
class GatewayManager extends CorddisEmitter {
  url = null;
  shards = null;
  _unavailableGuilds = new Map();
  _guildMembersQueue = new Map();

  /**
   * @arg {Client} client Client to initialize this gateway manager
   * @arg {GatewayManagerOptions} [options] Gateway manager options
   */
  constructor(client, options = {}) {
    super();
    this.client = client;
    this.intents = 'intents' in options ?
      options.intents.reduce((a, b) => a | intents[b], 0) :
      null;
    this.version = options.version || versions.GATEWAY_VERSION;
  }

  get latency() {
    return this.shards.reduce((a, b) => a + b.latency, 0) / this.shards.length;
  }

  /**
   * Connect to Discord's gateway
   * @arg {GatewayConnectionOptions} [options] Gateway connection options
   * @returns {Promise<void>}
   */
  async connect(options = {}) {
    const data = await this.client.rest.getGateway(true);
    const url = `${data.url}?encoding=${codec.encoding}&v=${this.version}`;
    if (options.compress) { // AAAA
    }
    this.url = url;

    const shards = options.shards || data.shards;
    const first = options.firstShardID || 0;
    const last = options.lastShardID || shards;
    const count = last - first;

    logger.debug(`Connecting ${count} shards (${first}-${last}) to ${url}`);

    const arr = this.shards = new Array(count);
    for (let i = first; i < last; ) {
      arr[i] = new Shard(i++, this.client);
    }

    this._startShardQueue(options);
  }

  async _startShardQueue(options) {
    const shards = this.shards;

    await shards[0].connect(this.url, options);
    for (let i = 1; i < shards.length; ) {
      await util.sleep(SHARD_CONNECT_DELAY);
      await shards[i++].connect(this.url, options);
    }
  }

  /**
   * Update status
   * @arg {StatusOptions} options Status options
   * @returns {void}
   */
  updateStatus(options) {
    for (const shard of this.shards) {
      shard.updateStatus(options);
    }
  }
}

module.exports = GatewayManager;

/**
 * @typedef {object} GatewayManagerOptions
 * @prop {number} [version] Gateway version
 */

/**
 * @typedef {object} GatewayConnectionOptions
 * @prop {stirng[]} [intents] Events to intentionally receive from Discord
 * @prop {number} [shards] Number of shards to connect
 * @prop {number} [firstShardID] Starting point of shard iteration
 * @prop {number} [lastShardID] Ending point of shard iteration
 * @prop {boolean} [guildSubscriptions] Subscribe to guild events
 * @prop {number} [largeThreshold] Number of offline members to cache
 * @prop {StatusOptions} [presence] Initial presence
 */
