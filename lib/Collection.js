/**
 * Class representing a collection of items
 */
class Collection extends Map {

  constructor(baseClass, iterable) {
    super();
    this.baseClass = baseClass;

    for (const item of iterable || []) {
      this.add(item);
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
}

module.exports = Collection;
