const Base = require('./Base');

class GuildChannel extends Base {

  constructor(data) {
    super(data.id);
    Object.assign(this, data);
  }
}

module.exports = GuildChannel;
