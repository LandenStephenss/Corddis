/**
 * Class representing a collection of items
 * @extends {Map}
 */
class Collection extends Map {

  constructor(baseClass, iterable, ...args) {
    super();
    this.baseClass = baseClass;

    for (const item of iterable || []) {
      this.add(item, ...args);
    }
  }

  add(item, ...args) {
    const existing = this.get(item.id);
    if (existing) {
      return existing;
    }

    if (!(item instanceof this.baseClass)) {
      item = new this.baseClass(item, ...args);
    }
    this.set(item.id, item);
    return item;
  }

  remove(item) {
    return this.delete(item.id) ? item : null;
  }
}

module.exports = Collection;
