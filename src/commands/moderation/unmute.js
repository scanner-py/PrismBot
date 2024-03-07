const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
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
            `:white_check_mark: ${targetUser}'s mute has been removed | ${reason}`
          )
          .setColor("#2ecc71");
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      await targetUser.timeout(null, reason);
      const embed = new EmbedBuilder()
        .setDescription(` :x:  ${targetUser} is not muted | ${reason}`)
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },
  run: async (client, message, args) => {
    const mentionedUser = message.mentions.members.first();
    const duration = args[1];
    const reason = args.slice(2).join(" ") || "No reason provided";
    const targetUser = await checkUserPermissionsPrefixCmd(
      message,
      mentionedUser
    );
    if (!targetUser) return; // If the function returns null, exit the command

    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (mentionedUser.isCommunicationDisabled()) {
        await mentionedUser.timeout(null, reason);
        const embed = new EmbedBuilder()
          .setDescription(
            `:white_check_mark: | ${mentionedUser}'s timeout has been updated to ${prettyMs(
              msDuration,
              {
                verbose: true,
              }
            )} | ${reason}`
          )
          .setColor("#2ecc71");
        return message.reply({ embeds: [embed] });
      }

      await mentionedUser.timeout(null, reason);
      const embed = new EmbedBuilder()
        .setDescription(
          `:white_check_mark: | ${mentionedUser} was timed out for ${prettyMs(
            msDuration,
            {
              verbose: true,
            }
          )} | ${reason}`
        )
        .setColor("#2ecc71");
      return message.reply({ embeds: [embed] });
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

  name: "unmute",
  description: "Mute a user.",
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
