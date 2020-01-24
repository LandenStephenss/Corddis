class User {

  constructor(data, client) {
    Object.assign(this, data);
    this.client = client;
  }
}

module.exports = User;
