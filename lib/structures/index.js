module.exports = {
  Base: require('./Base'),
  Emoji: require('./Emoji'),
  Guild: require('./Guild'),
  Invite: require('./Invite'),
  Member: require('./Member'),
  Message: require('./Message'),
  Presence: require('./Presence'),
  Role: require('./Role'),
  User: require('./User'),
  VoiceState: require('./VoiceState'),
  ...require('./channels')
};
