const Base = require('./Base');

/**
 * Class representing a user
 * @extends {Base}
 */
class User extends Base {

  constructor(data, client) {
    super(data.id);
    this.client = client;
    this.bot = !!data.bot;

    this.update(data);
  }

  update(data) {
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar;
  }
}

module.exports = User;
