const Base = require('./Base');

class Member extends Base {

  constructor(data, guild) {
    super(data.user.id);
    this.guild = guild;
    Object.assign(this, data);
  }
}

module.exports = Member;
