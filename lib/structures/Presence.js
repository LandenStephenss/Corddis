const Base = require('./Base');

/**
 * Class representing a presence
 */
class Presence extends Base {

  constructor(data, guild) {
    super(data.user.id);
    const client = guild.shard.client;

    this.guild = guild;
    this.user = client.users.add(data.user, client);

    this.update(data);
  }

  update(data) {
    this.game = data.game;
    this.status = data.status;
    this.activities = data.activities;
    this.clientStatus = data.client_status || null;
  }
}

module.exports = Presence;
