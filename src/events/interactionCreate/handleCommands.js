const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const { EmbedBuilder } = require("discord.js");
const { red } = require("../../../data/colors.json");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();
  const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

  if (!commandObject) return;

  const sendErrorEmbed = (description) => {
    const embed = new EmbedBuilder()
      .setColor(red)
      .setTitle("Access Denied")
      .setDescription(description);

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  };

  // check if using command in guild
  if (!interaction.inGuild()) {
    return sendErrorEmbed("You can only run this command inside a server.");
  } else if (commandObject.devOnly && !devs.includes(interaction.member.id)) {
    return sendErrorEmbed("Only developers are allowed to run this command.");
  } else if (commandObject.testOnly && interaction.guild.id !== testServer) {
    return sendErrorEmbed("This command cannot be run here.");
  }

  if (commandObject.permissionsRequired?.length) {
    for (const permission of commandObject.permissionsRequired) {
      if (!interaction.member.permissions.has(permission)) {
        return sendErrorEmbed("You do not have enough permissions.");
      }
    }
  }

  if (commandObject.botPermissions?.length) {
    const bot = interaction.guild.members.me;
    for (const permission of commandObject.botPermissions) {
      if (!bot.permissions.has(permission)) {
        return sendErrorEmbed("I don't have enough permissions.");
      }
    }
  }

  try {
    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};