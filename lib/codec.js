// eslint-disable-next-line no-undef
const ws = typeof window === 'undefined' ? require('ws') : WebSocket;

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
  encoding,
  decode,
  WebSocket: ws
};
