const codec = require('./codec');
const EventEmitter = require('events');
const Shard = require('./Shard');
const util = require('util');

const GATEWAY_VERSION = 6;
const SHARD_CONNECT_DELAY = 5000;

const sleep = util.promisify(setTimeout);

class GatewayManager extends EventEmitter {

  constructor(client) {
    super();
    this.client = client;
    this.url = null;
    this.shards = null;
  }

  async connect(options = {}) {
    const data = await this.client.rest.getGateway(true);
    this.url = `${data.url}?encoding=${codec.encoding}&v=${GATEWAY_VERSION}`;

    const shards = 'shards' in options ? options.shards : data.shards;
    const firstShardID = 'firstShardID' in options ? options.firstShardID : 0;
    const lastShardID = 'lastShardID' in options ? options.lastShardID : shards;

    const arr = this.shards = new Array(lastShardID - firstShardID);
    for (let i = firstShardID; i < lastShardID; ) {
      arr[i] = new Shard(i++, this.client);
    }

    this.startShardQueue(options);
  }

  async startShardQueue(options) {
    const shards = this.shards;
    await shards[0].connect(this.url, options);

    for (let i = 1; i < shards.length; i++) {
      await sleep(SHARD_CONNECT_DELAY);
      await shards[i].connect(this.url, options);
    }
  }

  updateStatus(status) {
    for (const shard of this.shards) {
      shard.updateStatus(status);
    }
  }
}

module.exports = GatewayManager;
