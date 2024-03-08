const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = async (message, mentionedUser) => {
  const targetUserRolePosition = mentionedUser.roles.highest.position;
  const requestUserRolePosition = message.member.roles.highest.position;
  const botRolePosition = message.guild.members.me.roles.highest.position;

  const deleteRespond = (msg) => {
    setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
  };

  if (!mentionedUser) {
    const embed = new EmbedBuilder()
      .setDescription(`:x: Please mention a user.`)
      .setColor("#ff1e45");
    return message.reply({ embeds: [embed] }).then(deleteRespond), null;
  }

  if (mentionedUser.user.bot) {
    const embed = new EmbedBuilder()
      .setDescription(`:x: I cannot target bots.`)
      .setColor("#ff1e45");
    return message.reply({ embeds: [embed] }).then(deleteRespond), null;
  }

  if (targetUserRolePosition >= requestUserRolePosition) {
    const embed = new EmbedBuilder()
      .setDescription(
        `:x: The target user role position is higher or same as your role position`
      )
      .setColor("#ff1e45");
    return message.reply({ embeds: [embed] }).then(deleteRespond), null;
  }

  if (targetUserRolePosition >= botRolePosition) {
    const embed = new EmbedBuilder()
      .setDescription(
        `:x: The target user has the same or higher role than me, I can't do that.`
      )
      .setColor("#ff1e45");
    return message.reply({ embeds: [embed] }).then(deleteRespond), null;
  }

  if (mentionedUser.permissions.has(PermissionFlagsBits.Administrator)) {
    const embed = new EmbedBuilder()
      .setDescription(`:x: That user is an admin, I can't do that.`)
      .setColor("#ff1e45");
    return message.reply({ embeds: [embed] }).then(deleteRespond), null;
  }

  return mentionedUser;
};
