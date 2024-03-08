const { prefix, devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const { EmbedBuilder } = require("discord.js");

module.exports = async (client, message) => {
  const deleteRespond = (msg) => {
    setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
  };
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
  const userMessage = message;
  // delete users cmd
  setTimeout(() => {
    userMessage
      .delete()
      .catch((error) => console.error("Failed to delete message:", error));
  }, 500); 
// check if cmd is dev only and usere is developer
  if (command.devOnly) {
    if (!devs.includes(message.author.id)) {
      const embed = new EmbedBuilder()
        .setDescription(`:x: Only developers are allowed to run this command.`)
        .setColor("#ff1e45");
      return message.channel.send({ embeds: [embed] }).then(deleteRespond);
    }
  }

  if (command.testOnly) {
    if (!(message.guild.id === testServer)) {
      const embed = new EmbedBuilder()
        .setDescription(`:x: This command cannot be run here.`)
        .setColor("#ff1e45");
      return message.channel.send({ embeds: [embed] }).then(deleteRespond);
    }
  }

  if (command.permissionsRequired?.length) {
    for (const permission of command.permissionsRequired) {
      if (!message.member.permissions.has(permission)) {
        const embed = new EmbedBuilder()
          .setDescription(`:x: you donot have enough permissions.`)
          .setColor("#ff1e45");
        return message.channel.send({ embeds: [embed] }).then(deleteRespond);
      }
    }
  }

  if (command.botPermissions?.length) {
    for (const permission of command.botPermissions) {
      const bot = message.guild.members.me;
      if (!bot.permissions.has(permission)) {
        const embed = new EmbedBuilder()
          .setDescription(`:x: i dont have enough permissions`)
          .setColor("#ff1e45");
        return message.channel.send({ embeds: [embed] }).then(deleteRespond);
      }
    }
  }

  try {
    await command.run(client, message, args);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};
