const Guild = require('../schemas/guild');
const { defaultPrefix } = require('../../config.json')

const getGuildPrefix = async (guildId) => {
  const guildData = await Guild.findOne({ guildId });
  return guildData ? guildData.prefix : defaultPrefix; // Return the custom prefix or default
};

const setGuildPrefix = async (guildId, newPrefix, interactionOrMsg) => {
  if (!newPrefix || newPrefix.trim().length === 0) {
    interactionOrMsg.channel.send('Prefix cannot be empty')
    throw new Error('Prefix cannot be empty');
  } else if (!isNaN(newPrefix)) {
    interactionOrMsg.channel.send('Prefix cannot be a number')
    throw new Error('Prefix cannot be a number');
  }


  let guildData = await Guild.findOne({ guildId });

  if (guildData) {
    guildData.prefix = newPrefix;
    await guildData.save();
  } else {
    guildData = new Guild({ guildId, prefix: newPrefix });
    await guildData.save();
  }
};

module.exports = { getGuildPrefix, setGuildPrefix };