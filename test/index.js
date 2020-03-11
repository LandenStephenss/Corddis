const corddis = require('../lib');
const config = require('./config');
const util = require('util');

const client = new corddis.Client(config.token, {
  messageLimit: 0
});

const shardReady = (data) => {
  corddis.logger.info(`Shard ${data.shard.id} has connected`);
  data.shard.updateStatus({
    status: 'dnd'
  });
};
client.gateway.listen(shardReady);

const ready = () => corddis.logger.info('All shards have connected to Discord');
client.gateway.listen(ready);

const messageCreate = async (data) => {
  if (
    data.message.author.id !== config.ownerID ||
    data.message.content.slice(0, 7) !== `${config.prefix}eval`
  ) {
    return;
  }

  let result;
  try {
    result = util.inspect(await eval(data.message.content.slice(8)), {
      depth: 0
    });
  }
  catch (error) {
    result = `${error.name}: ${error.message}`;
  }

  for (const part of result.match(/[^]{1,1990}/g)) {
    await data.message.channel.createMessage(`\`\`\`js\n${part}\n\`\`\``);
  }
};
client.gateway.listen(messageCreate);

client.gateway.connect();
