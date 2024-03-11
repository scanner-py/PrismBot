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
  name: "ban",
  description: "ban a user.",
  options: [
    {
      name: "user",
      description: "User you want to ban.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for the ban.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  // Callback function for Slash command execution
  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("user").value;
    const reason = interaction.options.get("reason")?.value || "No reason provided";

    const targetUser = await checkUserPermissions(interaction, mentionable);
    if (!targetUser) return;

    sendDm(interaction.guild.name, interaction.user.username, reason, targetUser);

    const banEmbed = await handleBan(targetUser, targetUser.user.username, reason);
    await interaction.reply({ embeds: [banEmbed] }); // Pass the embed object

  },
  // Function for prefix command execution 
  run: async (client, message, args) => {
    const mentionedUser = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    const targetUser = await checkUserPermissionsPrefixCmd(message, mentionedUser);
    if (!targetUser) return;

    sendDm(message.guild.name, message.author.username, reason, mentionedUser)
    const banEmbed = await handleBan(targetUser, targetUser.user.username, reason);
    await message.channel.send({ embeds: [banEmbed] }); // Pass the embed object

  },
};
// Send a DM to the banned user
async function sendDm(guildName, moderator, reason, targetUser) {
  try {
    const dmEmbed = new EmbedBuilder()
      .setDescription(`You have been banned from **${guildName}** by **${moderator}**. | ${reason}`)
      .setColor(red);
    await targetUser.send({ embeds: [dmEmbed] })
  } catch (e) {
    console.error(`Failed to send DM to ${targetUser.user.username}: ${e}`)
  }
}

async function handleBan(targetUser, targetUserName, reason) {
  try {
    // ban the user and delete his 24 hours worth of messages and create a confirmation embed
    await targetUser.ban({ deleteMessageSeconds: 60 * 60 * 24, reason });
    const banEmbed = new EmbedBuilder()
      .setDescription(`<:right:1216014282957918259> ${targetUserName} was banned. | ${reason}`)
      .setColor(green);
    return banEmbed; // Now return the embed object
  } catch (e) {
    console.log(e);
    interaction.channel.send("An error occurred");
  }
}
