module.exports = {

  get parent() {
    return this._parentID ? this.client.channels.get(this._parentID) || {
      id: this._parentID
    } : null;
  },

  _update(data) {
    this._parentID = data.parent_id;
  }
};
