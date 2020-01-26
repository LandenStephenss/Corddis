class Guild {

  constructor(data, shard) {
    Object.assign(this, data);
    this.shard = shard;
  }
}

module.exports = Guild;
