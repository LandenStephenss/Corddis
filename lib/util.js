const util = require('util');

const implement = (ctor, ...interfaces) => {
  const proto = ctor.prototype;
  for (const itf of interfaces) {
    Object.defineProperties(proto, Object.getOwnPropertyDescriptors(itf));
  }
  return ctor;
};

module.exports = {
  sleep: util.promisify(setTimeout),
  implement
};
