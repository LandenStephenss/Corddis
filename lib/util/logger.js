const util = require('util');

const write = (stream, ...args) => {
  const date = color('bold', dateFormat());
  const message = util.formatWithOptions({
    colors: true
  }, ...args);

  stream.write(Buffer.from(`${date} | ${message}\n`));
};

const dateFormat = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const hour = `${date.getHours()}`.padStart(2, 0);
  const minute = `${date.getMinutes()}`.padStart(2, 0);
  const second = `${date.getSeconds()}`.padStart(2, 0);

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const color = (a, b) => {
  const tag = util.inspect.colors[a];
  return `\x1b[${tag[0]}m${b}\x1b[${tag[1]}m`;
};

const err = (...args) => write(process.stderr, ...args);
const log = (...args) => write(process.stdout, ...args);

module.exports = {
  color,
  dateFormat,
  err,
  log,
  write,
  debug: (...args) => log(color('gray', 'DEBUG  '), '|', ...args),
  error: (...args) => err(color('red', 'ERROR  '), '|', ...args),
  fatal: (...args) => err(color('magenta', 'FATAL  '), '|', ...args),
  info: (...args) => log(color('blue', 'INFO   '), '|', ...args),
  success: (...args) => log(color('green', 'SUCCESS'), '|', ...args),
  trace: (...args) => log(color('cyan', 'TRACE  '), '|', ...args),
  warn: (...args) => err(color('yellow', 'WARN   '), '|', ...args)
};
