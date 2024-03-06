const { prefix, devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, message) => {
  if (
    !message.content ||
    !message.content.startsWith(prefix) ||
    message.author.bot
  )
    return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const localCommands = getLocalCommands();
  const command = localCommands.find((cmd) => cmd.name === commandName);

  if (!command) return;

  if (command.devOnly) {
    if (!devs.includes(message.author.id)) {
      message.reply("Only developers are allowed to run this command.");
      return;
    }
  }

  if (command.testOnly) {
    if (!(message.guild.id === testServer)) {
      message.reply("This command cannot be run here.");
      return;
    }
  }

  if (command.permissionsRequired?.length) {
    for (const permission of command.permissionsRequired) {
      if (!message.member.permissions.has(permission)) {
        message.reply("Not enough permissions.");
        return;
      }
    }
  }

  if (command.botPermissions?.length) {
    for (const permission of command.botPermissions) {
      const bot = message.guild.members.me;
      if (!bot.permissions.has(permission)) {
        message.reply("I don't have enough permissions.");
        return;
      }
    }
  }

  try {
    await command.callback(client, message, args);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};
