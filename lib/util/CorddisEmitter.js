const CorddisEvent = require('./CorddisEvent');

/**
 * Class that processes events from Discord's gateway
 */
class CorddisEmitter {
  events = new Map();

  /**
   * Listen to an event
   * @arg {Function} func Function with a name
   * @arg {string} [eventName] The name of the event
   * @returns {this}
   */
  listen(func, eventName) {
    const name = eventName || func.name;
    this.events.set(name, new CorddisEvent(func, name));
    return this;
  }

  /**
   * Ensue an event
   * @arg {string} eventName The name of the event
   * @arg {...any} args Arguments to pass to the event
   * @returns {this}
   */
  ensue(eventName, ...args) {
    const event = this.events.get(eventName);
    if (event) {
      event.run(...args);
    }
    return this;
  }
}

module.exports = CorddisEmitter;
