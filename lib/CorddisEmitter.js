const CorddisEvent = require('./CorddisEvent');

class CorddisEmitter {
  events = new Map();

  listen(func, eventName) {
    const name = eventName || func.name;
    this.events.set(name, new CorddisEvent(func, name));
    return this;
  }

  ensue(eventName, ...args) {
    const event = this.events.get(eventName);
    if (event) {
      event.run(...args);
    }
    return this;
  }
}

module.exports = CorddisEmitter;
