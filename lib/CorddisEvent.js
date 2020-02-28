class CorddisEvent {
  timesRan = 0;
  lastRan = null;

  constructor(callback, name) {
    this.callback = callback;
    this.name = name;
  }

  run(...args) {
    this.timesRan++;
    this.lastRan = Date.now();
    this.callback(...args);
  }
}

module.exports = CorddisEvent;
