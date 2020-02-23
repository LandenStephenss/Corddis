const {
  DISCORD_EPOCH
} = require('../constants');

class Base {

  constructor(id) {
    this.id = id;
  }

  get createdAt() {
    return this.id / 4194304 + DISCORD_EPOCH;
  }
}

module.exports = Base;
