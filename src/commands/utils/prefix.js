const { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Guild = require("../../schemas/guild");
const { transparent } = require('../../../data/colors.json')
const { setGuildPrefix } = require('../../utils/guildUtils');

module.exports = {
  name: "prefix",
  description: "set server prefix",
  options: [
    {
      name: "prefix",
      description: "Enter prefix you want to set for this server.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    const newPrefix = interaction.options.get('prefix').value;
    await setGuildPrefix(interaction.guild.id, newPrefix, interaction);
    await setPrefix(interaction, newPrefix);

  },

  run: async (client, message, args) => {
    let newPrefix = args[0]; // If there's only one argument, use it as the prefix

    await setGuildPrefix(message.guild.id, newPrefix, message);
    await setPrefix(message, newPrefix);

  }
}

async function setPrefix(interactionOrMsg, newPrefix) {
  const embed = new EmbedBuilder()
    .setTitle('Done')
    .setDescription(`<:right:1216014282957918259> prefix has been updated to ${newPrefix}`)
    .setColor(transparent);
  await interactionOrMsg.channel.send({ embeds: [embed] });

}