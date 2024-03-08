const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const { EmbedBuilder } = require("discord.js");
const { red } = require("../../../data/colors.json");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );

    if (!commandObject) return;

    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        const embed = new EmbedBuilder()
          .setColor(red)
          .setTitle("Access Denied")
          .setDescription("Only developers are allowed to run this command.");

        interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        const embed = new EmbedBuilder()
          .setColor(red)
          .setTitle("Access Denied")
          .setDescription("This command cannot be ran here.");
        interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          const embed = new EmbedBuilder()
            .setColor(red)
            .setTitle("Access Denied")
            .setDescription("you donot have enough permissions.");
          interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          const embed = new EmbedBuilder()
            .setColor(red)
            .setDescription("I don't have enough permissions.");
          interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });

          return;
        }
      }
    }

    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error running this command: ${error}`);
  }
};
