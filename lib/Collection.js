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

  /**
   * Checks if every item in this collection passes the test
   * @arg {Function} func A function returning a boolean
   * @returns {boolean}
   */
  every(func) {
    for (const item of this.values()) {
      if (!func(item)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Filters out items that pass the test
   * @arg {Function} func A function returning a boolean
   * @returns {boolean}
   */
  filter(func) {
    const arr = [];
    for (const item of this.values()) {
      if (func(item)) {
        arr.push(item);
      }
    }
    return arr;
  }

  /**
   * Finds the first item that passes the test
   * @arg {Function} func A function returning a boolean
   * @returns {any}
   */
  find(func) {
    for (const item of this.values()) {
      if (func(item)) {
        return item;
      }
    }
  }

  /**
   * Runs all items through the provided function and returns them
   * @arg {Function} func A function
   * @returns {any[]}
   */
  map(func) {
    const arr = [];
    for (const item of this.values()) {
      arr.push(func(item));
    }
    return arr;
  }

  /**
   * Reduces all the items into a single value
   * @arg {Function} func A function
   * @arg {any} [initialValue] Value to start the iteration
   * @returns {any}
   */
  reduce(func, initialValue) {
    const items = this.values();
    let res = initialValue === undefined ? items.next().value :initialValue;
    for (const item of items) {
      res = func(res, item);
    }
    return res;
  }

  remove(item) {
    const existing = this.get(item.id);
    if (existing) {
      this.delete(item.id);
      return existing;
    }
    return null;
  }

  /**
   * Reverse the order of all the items
   * @returns {any[]}
   */
  reverse() {
    let i = this.size;
    const arr = new Array(i);
    for (const item of this.values()) {
      arr[--i] = item;
    }
    return arr;
  }

  /**
   * Checks if at least one item passes the test
   * @arg {boolean} func A function returning a boolean
   * @returns {boolean}
   */
  some(func) {
    for (const item of this.values()) {
      if (func(item)) {
        return true;
      }
    }
    return false;
  }
}

module.exports = Collection;
