const Base = require('./Base');

class Member extends Base {

  constructor(data) {
    super(data.user.id);
    Object.assign(this, data);
  }
}

module.exports = Member;
