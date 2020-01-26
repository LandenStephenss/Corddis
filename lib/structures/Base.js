/**
 * Base structure for the other structures
 */
class Base {

  constructor(id) {
    if (id) {
      this.id = id;
    }
  }

  get createdAt() {
    return this.id / 4194304 + 1420070400000;
  }
}

module.exports = Base;
