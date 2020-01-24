class Guild {

  constructor(data, shard, client) {
    Object.assign(this, data);
    this.shard = shard;
    this.client = client;
  }
}

module.exports = Guild;
