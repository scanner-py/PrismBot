const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { red } = require("../../data/colors.json");
const { prefix, devs, testServer } = require("../../config.json");

const getLocalCommands = require("./getLocalCommands");

module.exports = async (message, mentionedUser) => {
  const targetUserRolePosition = mentionedUser?.roles.highest.position;
  const requestUserRolePosition = message.member.roles.highest.position;
  const botRolePosition = message.guild.members.me.roles.highest.position;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const localCommands = getLocalCommands();
  const command = localCommands.find((cmd) => cmd.name === commandName);

  const deleteRespond = (msg) => {
    setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
  };

  if (!mentionedUser) {
    const embed = new EmbedBuilder()
      .setDescription(`<:TickNo:1215704449020989500> Please mention a user.`)
      .setColor(red);
    return message.channel.send({ embeds: [embed] }).then(deleteRespond), null;
  }
  if (mentionedUser.id === message.author.id) {
    const embed = new EmbedBuilder()
      .setDescription(
        `<:TickNo:1215704449020989500> You cannot ${command.name} yourself.`
      )
      .setColor(red);
    return message.channel.send({ embeds: [embed] }).then(deleteRespond);
  }
  if (mentionedUser.user.bot) {
    const embed = new EmbedBuilder()
      .setDescription(`<:TickNo:1215704449020989500> I cannot target bots.`)
      .setColor(red);
    return message.channel.send({ embeds: [embed] }).then(deleteRespond), null;
  }

  if (mentionedUser.permissions.has(PermissionFlagsBits.Administrator)) {
    const embed = new EmbedBuilder()
      .setDescription(
        `<:TickNo:1215704449020989500> That user is an admin, I can't do that.`
      )
      .setColor(red);
    return message.channel.send({ embeds: [embed] }).then(deleteRespond), null;
  }

  if (targetUserRolePosition >= requestUserRolePosition) {
    const embed = new EmbedBuilder()
      .setDescription(
        `<:TickNo:1215704449020989500> The target user role position is higher or same as your role position`
      )
      .setColor(red);
    return message.channel.send({ embeds: [embed] }).then(deleteRespond), null;
  }

  if (targetUserRolePosition >= botRolePosition) {
    const embed = new EmbedBuilder()
      .setDescription(
        `<:TickNo:1215704449020989500> The target user has the same or higher role than me, I can't do that.`
      )
      .setColor(red);
    return message.channel.send({ embeds: [embed] }).then(deleteRespond), null;
  }

  return mentionedUser;
};
