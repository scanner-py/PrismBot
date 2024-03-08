const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = async (interaction, mentionable) => {
  const targetUser = await interaction.guild.members.fetch(mentionable);
  const deleteRespond = (msg) => {
    setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
  };

  if (!targetUser) {
    const embed = new EmbedBuilder()
      .setDescription(`:x: | This user doesn't exist in this server.`)
      .setColor("#ff1e45");
    await interaction.editReply({ embeds: [embed] }).then(deleteRespond);
    return null;
  }

  if (targetUser.user.bot) {
    const embed = new EmbedBuilder()
      .setDescription(`:x: | I cannot target bots.`)
      .setColor("#ff1e45");
    await interaction.editReply({ embeds: [embed]}).then(deleteRespond);
    // deleteRespond();  Assuming deleteRespond is a function
    return null;
  }

  if (targetUser.permissions.has(PermissionFlagsBits.Administrator)) {
    const embed = new EmbedBuilder()
      .setDescription(`:x: | That user is an admin, I can't do that.`)
      .setColor("#ff1e45");
    await interaction.editReply({ embeds: [embed] }).then(deleteRespond);

    return null;
  }

  const targetUserRolePosition = targetUser.roles.highest.position;
  const requestUserRolePosition = interaction.member.roles.highest.position;
  const botRolePosition = interaction.guild.members.me.roles.highest.position;

  if (targetUserRolePosition >= requestUserRolePosition) {
    const embed = new EmbedBuilder()
      .setDescription(
        `:x: | You don't have enough permission to use this command.`
      )
      .setColor("#ff1e45");
    await interaction
      .editReply({ embeds: [embed] })
      .then(deleteRespond);
    return null;
  }

  if (targetUserRolePosition >= botRolePosition) {
    const embed = new EmbedBuilder()
      .setDescription(
        `:x: | The target user has the same or higher role than me, I can't do that.`
      )
      .setColor("#ff1e45");
    await interaction.editReply({ embeds: [embed] }).then(deleteRespond);
    return null;
  }

  return targetUser;
};
