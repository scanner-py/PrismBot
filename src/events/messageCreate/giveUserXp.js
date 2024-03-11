const { Client, Message } = require("discord.js");
const Level = require("../../schemas/level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const { prefix } = require("../../../config.json");

const cooldowns = new Set();

/**
 * Get a random integer between min and max (inclusive).
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer between min and max
 */
function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate the XP to give based on the message length.
 * @param {string} messageContent - The message content
 * @returns {number} - The XP to give
 */
function calculateXpToGive(messageContent) {
  const messagelength = messageContent.replace(/\s/g, "").length;
  if (messagelength <= 10) {
    return getRandomXp(1, 3);
  } else if (messagelength <= 35) {
    return getRandomXp(4, 8);
  } else if (messagelength <= 60) {
    return getRandomXp(5, 10);
  } else {
    return getRandomXp(5, 15);
  }
}

/**
 * Handle user leveling up and save the updated level to the database.
 * @param {Message} message - The message object
 * @param {Level} level - The level document
 */
async function handleLevelUp(message, level) {
  if (level.xp > calculateLevelXp(level.level)) {
    level.xp = 0;
    level.level++;
    message.channel.send(
      `${message.member} you have leveled up to **level ${level.level}**.`
    );
  }

  await level.save().catch((e) => {
    console.log(`Error saving updated level ${e}`);
  });
}

/**
 * Add cooldown for the user.
 * @param {string} userId - The user ID
 */
function addCooldown(userId) {
  cooldowns.add(userId);
  setTimeout(() => {
    cooldowns.delete(userId);
  }, 15000);
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (
    !message.inGuild() ||
    message.author.bot ||
    cooldowns.has(message.author.id) ||
    message.content.startsWith(prefix)
  )
    return;

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    let level = await Level.findOne(query);

    if (level) {
      const messageContent = message.content;
      const xpToGive = calculateXpToGive(messageContent);
      level.xp += xpToGive;

      await handleLevelUp(message, level);
      addCooldown(message.author.id);
    } else {
      const xpToGive = getRandomXp(1, 3);
      level = new Level({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      await level.save();
      addCooldown(message.author.id);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};
