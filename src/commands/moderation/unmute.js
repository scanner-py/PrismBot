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
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const deleteRespond = (msg) => {
      setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
    };
    const mentionable = interaction.options.get("user").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await checkUserPermissions(interaction, mentionable);
    if (!targetUser) return;

    try {
      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(null, reason);
        const embed = new EmbedBuilder()
          .setDescription(
            `<:TickYes:1215704707432190063> ${targetUser} was unmuted | ${reason}`
          )
          .setColor(green);
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      await targetUser.timeout(null, reason);
      const embed = new EmbedBuilder()
        .setDescription(
          ` <:TickNo:1215704449020989500> i can't ${targetUser},they aren't muted.`
        )
        .setColor(red);
      await interaction.editReply({ embeds: [embed] }).then(deleteRespond);
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },
  run: async (client, message, args) => {
    const deleteRespond = (msg) => {
      setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
    };

    const mentionedUser = message.mentions.members.first();

    const reason = args.slice(1).join(" ") || "No reason provided";

    const targetUser = await checkUserPermissionsPrefixCmd(
      message,
      mentionedUser
    );

    if (!targetUser) return; // If the function returns null, exit the command);

    try {
      if (mentionedUser.isCommunicationDisabled()) {
        await mentionedUser.timeout(null, reason);
        const embed = new EmbedBuilder()
          .setDescription(
            `<:TickYes:1215704707432190063> ${targetUser} was unmuted | ${reason}`
          )
          .setColor(green);
        return message.channel.send({ embeds: [embed] });
      }
      mentionedUser.timeout(null, reason);
      const embed = new EmbedBuilder()
        .setDescription(
          ` <:TickNo:1215704449020989500> i can't ${targetUser},they aren't muted.`
        )
        .setColor(red);
      return message.channel.send({ embeds: [embed] }).then(deleteRespond);
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

  name: "unmute",
  description: "Mute a user.",
  deleted: false,
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
};
