const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { red } = require("../../data/colors.json");
const getLocalCommands = require("./getLocalCommands");

module.exports = async (interaction, mentionable) => {
  const targetUser = await interaction.guild.members.fetch(mentionable).catch(() => null);
  const localCommands = getLocalCommands();
  const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

  const sendErrorEmbed = (description) => {
    const embed = new EmbedBuilder()
      .setDescription(`<:No:1215704504180146277> ${description}`)
      .setColor(red);
    interaction.reply({ embeds: [embed], ephemeral: true });
  };

  if (!targetUser) {
    return sendErrorEmbed(`This user doesn't exist in this server.`), null;
  }

  const targetUserRolePosition = targetUser.roles.highest.position;
  const requestUserRolePosition = interaction.member.roles.highest.position;
  const botRolePosition = interaction.guild.members.me.roles.highest.position;

  // Check for various conditions
  if (mentionable === interaction.user.id) {
    return sendErrorEmbed(`You cannot ${commandObject.name} yourself.`);
  } else if (targetUser.user.bot) {
    return sendErrorEmbed("I cannot target bots.");
  } else if (targetUserRolePosition >= requestUserRolePosition) {
    return sendErrorEmbed("The target user role position is higher or same as your role position.");
  } else if (targetUserRolePosition >= botRolePosition) {
    return sendErrorEmbed("The target user has the same or higher role than me, I can't do that.");
  } else if (targetUser.permissions.has(PermissionFlagsBits.Administrator)) {
    return sendErrorEmbed("That user is an admin, I can't do that.");
  }

  return targetUser;
};