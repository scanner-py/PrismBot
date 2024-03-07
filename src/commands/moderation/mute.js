const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");
const ms = require("ms");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("user").value;
    const duration = interaction.options.get("duration").value; // 1d, 1 day, 1s 5s, 5m
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      const embed = new EmbedBuilder()
        .setDescription(`:x: | That user doesn't exist in this server.`)
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (targetUser.permissions.has(PermissionFlagsBits.Administrator)) {
      const embed = new EmbedBuilder()
        .setDescription(`:x: | That user is an admin, i can't do that`)
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (targetUser.user.bot) {
      const embed = new EmbedBuilder()
        .setDescription(`:x: | he is like a brother to me`)
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      const embed = new EmbedBuilder()
        .setDescription(`:x: | Please provide a valid timeout duration.`)
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      const embed = new EmbedBuilder()
        .setDescription(
          `:x: | Timeout duration cannot be less than 5 seconds or more than 28 days.`
        )
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      const embed = new EmbedBuilder()
        .setDescription(
          `:x: | You don't have enough permission to use this command`
        )
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      const embed = new EmbedBuilder()
        .setDescription(
          `:x: | They have the same or higher role than me, i can't do that`
        )
        .setColor("#ff1e45");
      await interaction.editReply({ embeds: [embed] });

      return;
    }

    // Timeout the user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        const embed = new EmbedBuilder()
          .setDescription(
            `:white_check_mark: | ${targetUser}'s timeout has been updated to ${prettyMs(
              msDuration,
              {
                verbose: true,
              }
            )} | ${reason}`
          )
          .setColor("#2ecc71");
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      await targetUser.timeout(msDuration, reason);
      const embed = new EmbedBuilder()
        .setDescription(
          `:white_check_mark: | ${targetUser} was timed out for ${prettyMs(
            msDuration,
            {
              verbose: true,
            }
          )} |  ${reason}`
        )
        .setColor("#2ecc71");
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

  name: "mute",
  description: "Mute a user.",
  options: [
    {
      name: "user",
      description: "User you want to mute.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Mute duration for ex (30m, 1h, 1 day).",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "Reason for the mute.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};
