const { defaultPrefix, devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const { EmbedBuilder } = require("discord.js");
const { red, transparent } = require("../../../data/colors.json");
const { getGuildPrefix } = require('../../utils/guildUtils');

module.exports = async (client, message) => {
  if (!message.content || message.author.bot) return; // Ignore messages from bots

  const localCommands = getLocalCommands();

  const prefix = await getGuildPrefix(message.guild.id); // Get the custom prefix for the guild
  const bot = `<@${client.user.id}>`
  // Check if the bot is pinged
  if (message.content === bot) {
    const embed = new EmbedBuilder()
      .setDescription(`My prefix is \`${prefix}\`. Type \`${prefix}help\` to see my commands.`)
      .setColor(transparent);
    return message.reply({ embeds: [embed] });
  }

  if (!message.content.startsWith(prefix)) return; // Check if the message starts with the prefix

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = localCommands.find((cmd) => cmd.name === commandName);

  if (!command) return; // If the command doesn't exist, return

  const userMessage = message;
  userMessage.delete().catch((error) => console.error("Failed to delete message:", error)); // Delete the user's command message

  const sendErrorEmbed = (description) => {
    const embed = new EmbedBuilder()
      .setTitle("Access Denied")
      .setDescription(`<:No:1215704504180146277> ${description}`)
      .setColor(red);
    message.channel.send({ embeds: [embed] }).then((msg) => setTimeout(() => msg.delete(), 5000)); // Delete the error message after 5 seconds
  };

  // Check permissions and restrictions
  if (command.devOnly && !devs.includes(message.author.id)) {
    return sendErrorEmbed("Only developers are allowed to run this command.");
  } else if (command.testOnly && message.guild.id !== testServer) {
    return sendErrorEmbed("This command cannot be run here.");
  }

  if (command.permissionsRequired?.length) {
    for (const permission of command.permissionsRequired) {
      if (!message.member.permissions.has(permission)) {
        return sendErrorEmbed("You do not have enough permissions.");
      }
    }
  }

  if (command.botPermissions?.length) {
    for (const permission of command.botPermissions) {
      const bot = message.guild.members.me;
      if (!bot.permissions.has(permission)) {
        return sendErrorEmbed("I don't have enough permissions.");
      }
    }
  }

  try {
    await command.run(client, message, args);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};