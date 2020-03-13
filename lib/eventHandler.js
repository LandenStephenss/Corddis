const {
  Channel,
  User,
  Invite,
  Message
} = require('./structures');

const {
  GUILD_MEMBER_CHUNK_SIZE
} = require('./constants');

const READY = (data, shard, client) => {
  shard.sessionID = data.session_id;
  client.user = client.users.add(data.user, client);

  for (const unavailableGuild of data.guilds) {
    client.gateway._unavailableGuilds.set(unavailableGuild.id, {
      id: unavailableGuild.id
    });
  }

  shard.ready = true;
  shard.ensue('shardReady');

  if (client.gateway.shards.every((shard) => shard.ready)) {
    client.gateway.ensue('ready');
  }
};

const CHANNEL_CREATE = (data, shard, client) => {
  let channel;
  if (data.guild_id) {
    const guild = client.guilds.get(data.guild_id);
    channel = guild.channels.add(Channel.from(data, guild));
  }
  else {
    channel = Channel.from(data, client);
  }
  shard.ensue('channelCreate', {
    channel: client.channels.add(channel)
  });
};

const CHANNEL_UPDATE = (data, shard, client) => {
  const channel = client.channels.get(data.channel.id);
  const oldChannel = channel.clone();
  shard.ensue('channelUpdate', {
    newChannel: channel.update(data),
    oldChannel
  });
};

const CHANNEL_DELETE = (data, shard, client) => {
  if (data.guild_id) {
    const guild = client.guilds.get(data.guild_id);
    guild.channels.remove(data);
  }
  shard.ensue('channelDelete', {
    channel: client.channels.remove(data)
  });
};

const CHANNEL_PINS_UPDATE = (data, shard, client) => {
  const channel = client.channels.get(data.channel_id);
  channel.lastPinTimestamp = data.last_pin_timestamp;
  shard.ensue('channelPinsUpdate', {
    channel
  });
};

const GUILD_CREATE = (data, shard, client) => {
  if (client.gateway._unavailableGuilds.has(data.id)) {
    client.gateway._unavailableGuilds.delete(data.id);
    client.guilds.add(data, shard);
    return;
  }
  const guild = client.guilds.get(data.id);
  if (guild) {
    guild.available = true;
    shard.ensue('guildAvailable', {
      guild
    });
    return;
  }
  shard.ensue('guildCreate', {
    guild: client.guilds.add(data, shard)
  });
};

const GUILD_UPDATE = (data, shard, client) => {
  const guild = client.guilds.get(data.id);
  const oldGuild = guild.clone();
  shard.ensue('guildUpdate', {
    newGuild: guild.update(data),
    oldGuild
  });
};

const GUILD_DELETE = (data, shard, client) => {
  const guild = client.guilds.get(data.id);
  if (data.unavailable) {
    guild.available = false;
    shard.ensue('guildUnavailable', {
      guild
    });
    return;
  }
  shard.ensue('guildDelete', {
    guild: client.guilds.remove(data)
  });
};

const GUILD_BAN_ADD = (data, shard, client) => {
  shard.ensue('guildBanAdd', {
    user: new User(data.user, client),
    guild: client.guilds.get(data.guild_id)
  });
};

const GUILD_BAN_REMOVE = (data, shard, client) => {
  shard.ensue('guildBanRemove', {
    user: new User(data.user, client),
    guild: client.guilds.get(data.guild_id)
  });
};

const GUILD_EMOJIS_UPDATE = (data, shard, client) => {
  const guild = client.guilds.get(data.guild_id);

  if (guild.emojis.size < data.emojis.length) {
    shard.ensue('guildEmojiCreate', {
      emoji: guild.emojis.add(data.emojis[data.emojis.length - 1], guild),
      guild
    });
    return;
  }

  const currentEmojis = guild.emojis.values();
  for (const emoji of data.emojis) {
    const nextEmoji = currentEmojis.next().value;

    if (emoji.id !== nextEmoji.id) {
      shard.ensue('guildEmojiDelete', {
        emoji: guild.emojis.remove(emoji),
        guild
      });
      return;
    }

    if (emoji.name !== nextEmoji.name) {
      const oldEmoji = nextEmoji.clone();
      nextEmoji.name = emoji.name;
      shard.ensue('guildEmojiUpdate', {
        oldEmoji,
        newEmoji: nextEmoji,
        guild
      });
      return;
    }
  }

  // For cases where the newest emoji was deleted
  shard.ensue('guildEmojiDelete', {
    emoji: guild.emojis.remove(currentEmojis.next().value),
    guild
  });
};

const GUILD_INTEGRATIONS_UPDATE = (data, shard, client) => {
  shard.ensue('guildIntegrationsUpdate', {
    guild: client.guilds.get(data.guild_id)
  });
};

const GUILD_MEMBER_ADD = (data, shard, client) => {
  const guild = client.guilds.get(data.guild_id);
  shard.ensue('guildMemberAdd', {
    member: guild.members.add(data, guild),
    guild
  });
};

const GUILD_MEMBER_UPDATE = (data, shard, client) => {
  const guild = client.guilds.get(data.guild_id);
  const member = guild.members.get(data.user.id);
  const oldMember = member ? member.clone() : null;
  shard.ensue('guildMemberUpdate', {
    newMember: member ? member.update(data) : guild.members.add(data, guild),
    oldMember,
    guild
  });
};

const GUILD_MEMBER_REMOVE = (data, shard, client) => {
  const guild = client.guilds.get(data.guild_id);
  const member = guild.members.remove(data.user) || {
    id: data.user.id,
    user: data.user
  };

  if (!client.guilds.some((guild) => guild.members.has(member.id))) {
    shard.ensue('userRemove', {
      user: client.users.remove(member.user)
    });
  }

  shard.ensue('guildMemberRemove', {
    member,
    guild
  });
};

const GUILD_MEMBERS_CHUNK = (data, shard, client) => {
  const guild = client.guilds.get(data.guild_id);
  for (const member of data.members) {
    guild.members.add(member, guild);
  }
  const queue = client.gateway._guildMembersQueue.get(guild.id);
  if (data.not_found) {
    queue.notFound.push(...data.not_found);
  }
  if (data.members.length < GUILD_MEMBER_CHUNK_SIZE) {
    shard._clearGuildMembersQueue(guild.id);
  }
};

const GUILD_ROLE_CREATE = (data, shard, client) => {
  const guild = client.guilds.get(data.guild_id);
  shard.ensue('guildRoleCreate', {
    role: guild.roles.add(data, guild),
    guild
  });
};

const GUILD_ROLE_UPDATE = (data, shard, client) => {
  const guild = client.guilds.get(data.guild_id);
  const role = guild.roles.get(data.role.id);
  const oldRole = role.clone();
  shard.ensue('guildRoleUpdate', {
    newRole: role.update(data),
    oldRole,
    guild
  });
};

const GUILD_ROLE_DELETE = (data, shard, client) => {
  const guild = client.guilds.get(data.guild_id);
  shard.ensue('guildRoleDelete', {
    role: guild.roles.remove(data),
    guild
  });
};

const INVITE_CREATE = (data, shard, client) => {
  shard.ensue('inviteCreate', {
    invite: new Invite(data, client)
  });
};

const INVITE_DELETE = (data, shard, client) => {
  shard.ensue('inviteDelete', {
    code: data.code,
    channel: client.channels.get(data.channel_id) || {
      id: data.channel_id
    },
    guild: client.guilds.get(data.guild_id) || {
      id: data.guild_id
    }
  });
};

const MESSAGE_CREATE = (data, shard, client) => {
  const channel = client.channels.get(data.channel_id);
  shard.ensue('messageCreate', {
    message: channel.messages.add(data, client)
  });
};

const MESSAGE_UPDATE = (data, shard, client) => {
  const channel = client.channels.get(data.channel_id);
  const message = channel.messages.get(data.id);
  const oldMessage = message ? message.clone() : null;
  shard.ensue('messageUpdate', {
    newMessage: message ? message.update(data) : new Message(data, client),
    oldMessage
  });
};

const MESSAGE_DELETE = (data, shard, client) => {
  const channel = client.channels.get(data.channel_id);
  shard.ensue('messageDelete', {
    message: channel.messages.remove(data) || {
      id: data.message_id,
      channel,
      guild: client.guilds.get(data.guild_id)
    }
  });
};

const MESSAGE_DELETE_BULK = (data, shard, client) => {
  const channel = client.channels.get(data.channel_id);
  for (const messageID of data.ids) {
    channel.messages.delete(messageID);
  }
  shard.ensue('messageDeleteBulk', {
    messageIDs: data.ids,
    channel,
    guild: client.channels.get(data.guild_id)
  });
};

const MESSAGE_REACTION_ADD = (data, shard, client) => {
  const channel = client.channels.get(data.channel_id);
  if (data.guild_id && data.member) {
    const guild = client.guilds.get(data.guild_id);
    guild.members.add(data.member, guild);
  }

  shard.ensue('messageReactionAdd', {
    emoji: data.emoji,
    channel,
    message: channel.messages.get(data.message_id) || {
      id: data.message_id
    },
    user: client.users.get(data.user_id) || {
      id: data.user_id
    }
  });
};

const MESSAGE_REACTION_REMOVE = (data, shard, client) => {
  const channel = client.channels.get(data.channel_id);

  shard.ensue('messageReactionRemove', {
    emoji: data.emoji,
    channel,
    message: channel.messages.get(data.message_id) || {
      id: data.message_id
    },
    user: client.users.get(data.user_id) || {
      id: data.user_id
    }
  });
};

const MESSAGE_REACTION_REMOVE_ALL = (data, shard, client) => {
  const channel = client.channels.get(data.channel_id);

  shard.ensue('messageReactionRemoveAll', {
    channel,
    message: channel.messages.get(data.message_id) || {
      id: data.message_id
    }
  });
};

const MESSAGE_REACTION_REMOVE_EMOJI = (data, shard, client) => {
  const channel = client.channels.get(data.channel_id);

  shard.ensue('messageReactionRemoveEmoji', {
    emoji: data.emoji,
    channel,
    message: channel.messages.get(data.message_id) || {
      id: data.message_id
    }
  });
};

const PRESENCE_UPDATE = (data, shard, client) => {
  const guild = client.guilds.get(data.guild_id);
  const presence = guild.presences.get(data.user.id);
  if (!presence) {
    shard.ensue('presenceUpdate', {
      newPresence: guild.presences.add(data, guild),
      oldPresence: null,
      guild
    });
    return;
  }
  if (data.status === 'offline') {
    shard.ensue('presenceUpdate', {
      newPresence: null,
      oldPresence: guild.presences.remove(presence),
      guild
    });
    return;
  }
  const oldPresence = presence.clone();
  shard.ensue('presenceUpdate', {
    newPresence: presence.update(data),
    oldPresence,
    guild
  });
};

const TYPING_START = () => {};

const USER_UPDATE = (data, shard, client) => {
  const user = client.users.get(data.id);
  const oldUser = user.clone();
  shard.ensue('userUpdate', {
    newUser: user.update(data),
    oldUser
  });
};

const VOICE_STATE_UPDATE = (data, shard, client) => {
  const guild = client.guilds.get(data.guild_id);
  const voiceState = guild.voiceStates.get(data.user_id);
  if (!voiceState) {
    shard.ensue('voiceStateUpdate', {
      newVoiceState: guild.voiceStates.add(data, guild),
      oldVoiceState: null,
      guild
    });
    return;
  }
  if (!data.channel_id) {
    shard.ensue('VoiceStateUpdate', {
      newVoiceState: null,
      oldVoiceState: guild.voiceStates.remove(voiceState),
      guild
    });
    return;
  }
  const oldVoiceState = voiceState.clone();
  shard.ensue('voiceStateUpdate', {
    newVoiceState: voiceState.update(data),
    oldVoiceState,
    guild
  });
};

const VOICE_SERVER_UPDATE = () => {};

const WEBHOOKS_UPDATE = (data, shard, client) => {
  shard.ensue('webhooksUpdate', {
    channel: client.channels.get(data.channel_id),
    guild: client.guilds.get(data.guild_id)
  });
};

module.exports = {
  READY,
  CHANNEL_CREATE,
  CHANNEL_UPDATE,
  CHANNEL_DELETE,
  CHANNEL_PINS_UPDATE,
  GUILD_CREATE,
  GUILD_UPDATE,
  GUILD_DELETE,
  GUILD_BAN_ADD,
  GUILD_BAN_REMOVE,
  GUILD_EMOJIS_UPDATE,
  GUILD_INTEGRATIONS_UPDATE,
  GUILD_MEMBER_ADD,
  GUILD_MEMBER_UPDATE,
  GUILD_MEMBER_REMOVE,
  GUILD_MEMBERS_CHUNK,
  GUILD_ROLE_CREATE,
  GUILD_ROLE_UPDATE,
  GUILD_ROLE_DELETE,
  INVITE_CREATE,
  INVITE_DELETE,
  MESSAGE_CREATE,
  MESSAGE_UPDATE,
  MESSAGE_DELETE,
  MESSAGE_DELETE_BULK,
  MESSAGE_REACTION_ADD,
  MESSAGE_REACTION_REMOVE,
  MESSAGE_REACTION_REMOVE_ALL,
  MESSAGE_REACTION_REMOVE_EMOJI,
  PRESENCE_UPDATE,
  TYPING_START,
  USER_UPDATE,
  VOICE_STATE_UPDATE,
  VOICE_SERVER_UPDATE,
  WEBHOOKS_UPDATE
};
