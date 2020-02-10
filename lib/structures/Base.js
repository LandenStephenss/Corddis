class Base {

  constructor(id) {
    if (id) {
      this.id = id;
    }
  }

  get createdAt() {
    return this.id / 4194304 + 1420070400000;
  }

  update(data, overrides = {}) {
    for (const key in data) {
      const prop = key in overrides ? overrides[key] : key;
      if (prop !== false) {
        this[prop] = data[key];
      }
    }

    return this;
  }
}

module.exports = Base;
