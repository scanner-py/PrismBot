const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { red } = require("../../data/colors.json");
const getLocalCommands = require("./getLocalCommands");

module.exports = async (interaction, mentionable) => {
  const targetUser = await interaction.guild.members.fetch(mentionable);
  const localCommands = getLocalCommands();
  const commandObject = localCommands.find(
    (cmd) => cmd.name === interaction.commandName
  );
  if (!targetUser) {
    const embed = new EmbedBuilder()
      .setDescription(
        `<:No:1215704504180146277> This user doesn't exist in this server.`
      )
      .setColor(red);
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return null;
  }

  if (mentionable === interaction.user.id) {
    const embed = new EmbedBuilder()
      .setDescription(
        `<:No:1215704504180146277> You cannot ${commandObject.name} yourself.`
      )
      .setColor(red);
    interaction.reply({ embeds: [embed], ephemeral: true });
    return null;
  }

  if (targetUser.user.bot) {
    const embed = new EmbedBuilder()
      .setDescription(`<:No:1215704504180146277> I cannot target bots.`)
      .setColor(red);
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return null;
  }

  if (targetUser.permissions.has(PermissionFlagsBits.Administrator)) {
    const embed = new EmbedBuilder()
      .setDescription(
        `<:No:1215704504180146277> That user is an admin, I can't do that.`
      )
      .setColor(red);
    await interaction.reply({ embeds: [embed], ephemeral: true });

    return null;
  }

  const targetUserRolePosition = targetUser.roles.highest.position;
  const requestUserRolePosition = interaction.member.roles.highest.position;
  const botRolePosition = interaction.guild.members.me.roles.highest.position;

  if (targetUserRolePosition >= requestUserRolePosition) {
    const embed = new EmbedBuilder()
      .setDescription(
        `<:No:1215704504180146277> the target user role position is higher or same as your role position`
      )
      .setColor(red);
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return null;
  }

  if (targetUserRolePosition >= botRolePosition) {
    const embed = new EmbedBuilder()
      .setDescription(
        `<:No:1215704504180146277> The target user has the same or higher role than me, I can't do that.`
      )
      .setColor(red);
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return null;
  }

  return targetUser;
};
