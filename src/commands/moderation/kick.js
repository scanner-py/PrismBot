const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { red, green } = require("../../../data/colors.json");
const checkUserPermissions = require("../../utils/checkUserPermissions");
const checkUserPermissionsPrefixCmd = require("../../utils/checkUserPermissionsPrefixCmd");

module.exports = {
  name: "kick",
  description: "kick a user.",
  options: [
    {
      name: "user",
      description: "User you want to kick.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for the kick.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("user").value; // target user
    const reason = interaction.options.get("reason")?.value || "No reason provided"; // reason

    const targetUser = await checkUserPermissions(interaction, mentionable);
    if (!targetUser) return;

    sendDm(interaction.guild.name, interaction.user.username, reason, targetUser)
    const kickEmbed = await handleKick(targetUser, targetUser.user.username, reason)

    await interaction.reply({ embeds: [kickEmbed] });
  },

  run: async (client, message, args) => {
    const mentionedUser = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    const targetUser = await checkUserPermissionsPrefixCmd(message, mentionedUser);
    if (!targetUser) return;

    sendDm(message.guild.name, message.author.name, reason, targetUser)
    const kickEmbed = await handleKick(targetUser, targetUser.user.username, reason)


    await message.channel.send({ embeds: [kickEmbed] });


  },

};
// Send a DM to the kicked user
async function sendDm(guildName, moderator, reason, targetUser) {
  try {
    const dmEmbed = new EmbedBuilder()
      .setDescription(`You have been kicked from **${guildName}** by **${moderator}**. | ${reason}`)
      .setColor(red);
    await targetUser.send({ embeds: [dmEmbed] })
  } catch (e) {
    console.error(`Failed to send DM to ${targetUser.user.username}: ${e}`)
  }
}
// handle kick and create a confirmation embed
async function handleKick(targetUser, targetUserName, reason) {
  try {
    await targetUser.kick(reason);
    const embed = new EmbedBuilder()
      .setDescription(`<:right:1216014282957918259> ${targetUser} was kicked. | ${reason}`)
      .setColor(green);
    return embed
  } catch (e) {
    console.log(e);
    interaction.channel.send("An error occurred");
  }
}