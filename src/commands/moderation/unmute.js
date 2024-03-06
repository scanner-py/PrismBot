const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");
const { createEmbed } = require("../../utils/templates/butterEmbed");
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

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      const embed = createEmbed()
        .setDescription(`:x: That user doesn't exist in this server.`)
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (targetUser.permissions.has(PermissionFlagsBits.Administrator)) {
      const embed = createEmbed()
        .setDescription(`:x: That user is a admin, i can't do that`)
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (targetUser.user.bot) {
      const embed = createEmbed()
        .setDescription(`:x: That user is a bot, i can't do that`)
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      const embed = createEmbed()
        .setDescription(`:x: You don't have enough permission to use this command`)
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      const embed = createEmbed()
        .setDescription(
          `:x: They have the same or higher role than me, i can't do that`
        )
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });

      return;
    }

    try {

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(null, reason);
        const embed = createEmbed().setDescription(
          `:white_check_mark: ${targetUser}'s mute has been removed | ${reason}`
        ).setColor("#2ecc71");
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      await targetUser.timeout(null, reason);
      const embed = createEmbed().setDescription(
        ` :x:  ${targetUser} is not muted | ${reason}`
      ).setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
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
