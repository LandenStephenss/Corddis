let encode = JSON.stringify;
let decode = JSON.parse;
let encoding = 'json';

try {
  const erlpack = require('erlpack');
  encode = erlpack.pack;
  decode = erlpack.unpack;
  encoding = 'etf';
}
catch { // eslint-disable-line no-empty
}

module.exports = {
  encode,
  decode,
  encoding,
  // eslint-disable-next-line no-undef
  WebSocket: typeof window === 'undefined' ? require('ws') : WebSocket
};
