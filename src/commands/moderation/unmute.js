const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { red, green } = require("../../../data/colors.json");
const ms = require("ms");
const checkUserPermissions = require("../../utils/checkUserPermissions");
const checkUserPermissionsPrefixCmd = require("../../utils/checkUserPermissionsPrefixCmd");

module.exports = {
  name: "unmute",
  description: "Unmute a user.",
  options: [
    {
      name: "user",
      description: "User you want to unmute.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for the unmute.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("user").value;
    const reason = interaction.options.get("reason")?.value || "No reason provided";

    const targetUser = await checkUserPermissions(interaction, mentionable);
    if (!targetUser) return;
    const unmuteEmbed = await handleUnmute(targetUser, reason, interaction);
    await interaction.reply({ embeds: [unmuteEmbed] });
  },
  run: async (client, message, args) => {
    const mentionedUser = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    const targetUser = await checkUserPermissionsPrefixCmd(message, mentionedUser);
    if (!targetUser) return;

    const unmuteEmbed = await handleUnmute(mentionedUser, reason, message);
    message.channel.send({ embeds: [unmuteEmbed] });
  }
};

async function handleUnmute(targetUser, reason, interactionOrMsg) {
  try {
    if (!targetUser.isCommunicationDisabled()) {
      await targetUser.timeout(null, reason);
      const embed = new EmbedBuilder()
        .setDescription(`<:No:1215704504180146277> i can't ${targetUser},they aren't muted.`)
        .setColor(red);
      return embed;
    } else {
      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(null, reason);
        const embed = new EmbedBuilder()
          .setDescription(`<:right:1216014282957918259> ${targetUser} was unmuted | ${reason}`)
          .setColor(green);
        return embed;
      }
    }
  } catch (e) {
    console.log(e)
    interactionOrMsg.channel.send('An error occurred')
  }
}