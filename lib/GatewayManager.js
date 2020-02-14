const codec = require('./codec');
const EventEmitter = require('events');
const Shard = require('./Shard');
const util = require('util');

const GATEWAY_VERSION = 6;
const SHARD_CONNECT_DELAY = 5000;

const sleep = util.promisify(setTimeout);

/**
 * Class representing a gateway manager
 * @extends {EventEmitter}
 */
class GatewayManager extends EventEmitter {
  url = null;
  shards = null;
  _unavailableGuilds = new Map();

  /**
   * @arg {Client} client Client to initialize this gateway manager
   * @arg {GatewayManagerOptions} [options] Gateway manager options
   */
  constructor(client, options = {}) {
    super();
    this.client = client;

    const reduce = (a, b) => (a[b] = true, a);
    this.disableEvents = (options.disableEvents || []).reduce(reduce, {});

    this.version = options.version || GATEWAY_VERSION;
  }

  /**
   * Connect to Discord's gateway
   * @arg {GatewayConnectionOptions} [options] Gateway connection options
   * @returns {Promise<void>}
   */
  async connect(options = {}) {
    const data = await this.client.rest.getGateway(true);
    this.url = `${data.url}?encoding=${codec.encoding}&v=${this.version}`;

    const shards = options.shards || data.shards;
    const firstShardID = options.firstShardID || 0;
    const lastShardID = options.lastShardID || shards;

    const arr = this.shards = new Array(lastShardID - firstShardID);
    for (let i = firstShardID; i < lastShardID; ) {
      arr[i] = new Shard(i++, this.client);
    }

    this.startShardQueue(options);
  }

  async startShardQueue(options) {
    const shards = this.shards;
    let i = 0;
    do {
      await shards[i++].connect(this.url, options);
      await sleep(SHARD_CONNECT_DELAY);
    }
    while (i < shards.length);
  }

  /**
   * Update status
   * @arg {StatusOptions} options Status options
   * @returns {void}
   */
  updateStatus(options) {
    for (const shard of this.shards) {
      shard.updateStatus(status);
    }
  }
}

module.exports = GatewayManager;

/**
 * @typedef {object} GatewayManagerOptions
 * @prop {string[]} [disableEvents] Events to not process
 * @prop {number} [version] Gateway version
 */

/**
 * @typedef {object} GatewayConnectionOptions
 * @prop {number} [shards] Number of shards to connect
 * @prop {number} [firstShardID] Starting point of shard iteration
 * @prop {number} [lastShardID] Ending point of shard iteration
 * @prop {boolean} [guildSubscriptions] Subscribe to guild events
 * @prop {number} [largeThreshold] Number of offline members to cache
 * @prop {StatusOptions} [presence] Initial presence
 */
