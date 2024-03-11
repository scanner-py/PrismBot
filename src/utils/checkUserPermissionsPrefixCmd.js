const { red } = require("../../data/colors.json");
const { prefix } = require("../../config.json");
const getLocalCommands = require("./getLocalCommands");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = async (message, mentionedUser) => {
  const targetUserRolePosition = mentionedUser?.roles.highest.position;
  const requestUserRolePosition = message.member.roles.highest.position;
  const botRolePosition = message.guild.members.me.roles.highest.position;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const localCommands = getLocalCommands();
  const command = localCommands.find((cmd) => cmd.name === commandName);

  const deleteRespond = (msg) => {
    setTimeout(() => msg.delete(), 5000); // delete the reply after 5 seconds
  };

  const sendErrorEmbed = (description) => {
    const embed = new EmbedBuilder()
      .setDescription(`<:No:1215704504180146277> ${description}`)
      .setColor(red);
    return message.channel.send({ embeds: [embed] }).then(deleteRespond);
  };

  if (!mentionedUser) {
    return sendErrorEmbed("Please mention a user."), null;
  } else if (mentionedUser.id === message.author.id) {
    return sendErrorEmbed(`You cannot ${command.name} yourself.`);
  } else if (mentionedUser.user.bot) {
    return sendErrorEmbed("I cannot target bots."), null;
  } else if (targetUserRolePosition >= requestUserRolePosition) {
    return sendErrorEmbed("The target user role position is higher or same as your role position"), null;
  } else if (targetUserRolePosition >= botRolePosition) {
    return sendErrorEmbed("The target user has the same or higher role than me, I can't do that."), null;
  } else if (mentionedUser.permissions.has(PermissionFlagsBits.Administrator)) {
    return sendErrorEmbed("That user is an admin, I can't do that."), null;
  }

  return mentionedUser;
};