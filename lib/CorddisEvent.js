/**
 * Class representing an event
 */
class CorddisEvent {
  timesRan = 0;
  lastRan = null;

  /**
   * @arg {Function} callback A named function
   * @arg {string} [name] The name to use if not the callback's name
   */
  constructor(callback, name) {
    this.callback = callback;
    this.name = name;
  }

  /**
   * Run the event
   * @arg {...any} args Arguments to pass to the callback
   * @returns {void}
   */
  run(...args) {
    this.timesRan++;
    this.lastRan = Date.now();
    this.callback(...args);
  }
}

module.exports = CorddisEvent;
