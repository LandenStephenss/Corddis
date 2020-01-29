const Base = require('./Base');

/**
 * Class representing a user
 * @extends {Base}
 */
class User extends Base {

  constructor(data, client) {
    super(data.id);
    this.client = client;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar;
    this.bot = !!data.bot;
  }
}

module.exports = User;
