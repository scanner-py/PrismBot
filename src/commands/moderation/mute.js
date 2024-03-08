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
    const deleteRespond = (msg) => {
      setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
    };
    const mentionable = interaction.options.get("user").value;
    const duration = interaction.options.get("duration").value; // 1d, 1 day, 1s 5s, 5m
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    // await interaction.deferReply();
    const targetUser = await checkUserPermissions(interaction, mentionable);
    if (!targetUser) return;
    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      const embed = new EmbedBuilder()
        .setDescription(`:x: | Please provide a valid timeout duration.`)
        .setColor("#ff1e45");
      await interaction.reply({ embeds: [embed] }).then(deleteRespond);
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      const embed = new EmbedBuilder()
        .setDescription(
          `:x: | Timeout duration cannot be less than 5 seconds or more than 28 days.`
        )
        .setColor("#ff1e45");
      await interaction.reply({ embeds: [embed] }).then(deleteRespond);
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
        await interaction.reply({ embeds: [embed] });
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
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

  run: async (client, message, args) => {
    const deleteRespond = (msg) => {
      setTimeout(() => msg.delete(), 5000); // delete the reply after 5 sce
    };
    const mentionedUser = message.mentions.members.first();
    const duration = args[1];
    const reason = args.slice(2).join(" ") || "No reason provided";
    const targetUser = await checkUserPermissionsPrefixCmd(
      message,
      mentionedUser
    );
    if (!targetUser) return; // If the function returns null, exit the command

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      const embed = new EmbedBuilder()
        .setDescription(`:x: | Please provide a valid timeout duration.`)
        .setColor("#ff1e45");
      return message.reply({ embeds: [embed] }).then(deleteRespond);
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      const embed = new EmbedBuilder()
        .setDescription(
          `:x: | Timeout duration cannot be less than 5 seconds or more than 28 days.`
        )
        .setColor("#ff1e45");
      return message.reply({ embeds: [embed] }.then(deleteRespond));
    }

    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (mentionedUser.isCommunicationDisabled()) {
        await mentionedUser.timeout(msDuration, reason);
        const embed = new EmbedBuilder()
          .setDescription(
            `:white_check_mark: | ${mentionedUser}'s mute has extended to ${prettyMs(
              msDuration,
              {
                verbose: true,
              }
            )} | ${reason}`
          )
          .setColor("#2ecc71");
        return message.channel.send({ embeds: [embed] });
      }

      await mentionedUser.timeout(msDuration, reason);
      const embed = new EmbedBuilder()
        .setDescription(
          `:white_check_mark: | ${mentionedUser} has been muted for ${prettyMs(
            msDuration,
            {
              verbose: true,
            }
          )} | ${reason}`
        )
        .setColor("#2ecc71");
      return message.channel.send({ embeds: [embed] });
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
